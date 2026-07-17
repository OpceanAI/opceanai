package main

// canvas.go — half-block pixel canvas shared with the SSH sibling.
//
// Each terminal cell renders two vertical pixels: fg = top pixel (▀ glyph),
// bg = bottom pixel. A 120x40 terminal becomes a 120x80 pixel framebuffer.

import (
	"math"
	"strconv"
	"strings"
)

// ---- color helpers ---------------------------------------------------------

func lerp(a, b float64, t float64) float64 { return a + (b-a)*t }

func lerpRGB(a, b RGB, t float64) RGB {
	if t < 0 {
		t = 0
	} else if t > 1 {
		t = 1
	}
	return RGB{
		uint8(lerp(float64(a.R), float64(b.R), t)),
		uint8(lerp(float64(a.G), float64(b.G), t)),
		uint8(lerp(float64(a.B), float64(b.B), t)),
	}
}

// hash noise in [0,1), deterministic per (x, y, seed).
func noise(x, y, seed int) float64 {
	h := uint32(x)*374761393 + uint32(y)*668265263 + uint32(seed)*2246822519
	h ^= h >> 13
	h *= 1274126177
	h ^= h >> 16
	return float64(h) / float64(math.MaxUint32)
}

// valueNoise is smooth 2D value noise in [0,1): hash noise sampled on an
// integer lattice with smoothstep interpolation — foxing blotches, flicker.
func valueNoise(x, y float64, seed int) float64 {
	xi, yi := math.Floor(x), math.Floor(y)
	xf, yf := x-xi, y-yi
	sx := xf * xf * (3 - 2*xf)
	sy := yf * yf * (3 - 2*yf)
	ix, iy := int(xi), int(yi)
	n00 := noise(ix, iy, seed)
	n10 := noise(ix+1, iy, seed)
	n01 := noise(ix, iy+1, seed)
	n11 := noise(ix+1, iy+1, seed)
	return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy)
}

func clamp01(v float64) float64 {
	if v < 0 {
		return 0
	}
	if v > 1 {
		return 1
	}
	return v
}

// stage maps a global reveal value onto one animation stage [a,b] with a
// smoothstep ease — the ink-drawing choreography is built out of these.
func stage(rev, a, b float64) float64 {
	t := clamp01((rev - a) / (b - a))
	return t * t * (3 - 2*t)
}

// ---- ansi 256 quantization -------------------------------------------------

func to256(c RGB) int {
	r, g, b := int(c.R), int(c.G), int(c.B)
	qi := func(v int) int {
		if v < 48 {
			return 0
		}
		if v < 114 {
			return 1
		}
		return (v - 35) / 40
	}
	cr, cg, cb := qi(r), qi(g), qi(b)
	cv := func(i int) int {
		if i == 0 {
			return 0
		}
		return 55 + i*40
	}
	cubeIdx := 16 + 36*cr + 6*cg + cb
	cubeDist := sq(cv(cr)-r) + sq(cv(cg)-g) + sq(cv(cb)-b)

	gray := (r + g + b) / 3
	gi := (gray - 3) / 10
	if gi < 0 {
		gi = 0
	}
	if gi > 23 {
		gi = 23
	}
	gv := 8 + gi*10
	grayDist := sq(gv-r) + sq(gv-g) + sq(gv-b)
	if grayDist < cubeDist {
		return 232 + gi
	}
	return cubeIdx
}

func sq(v int) int { return v * v }

// ---- canvas ----------------------------------------------------------------

type overlayCell struct {
	set bool
	r   rune
	fg  RGB
}

// Canvas is a W x H pixel framebuffer rendered as W x H/2 terminal cells.
type Canvas struct {
	W, H      int // pixels; H is always even
	px        []RGB
	overlay   []overlayCell // cell grid: W x H/2
	truecolor bool
}

func NewCanvas(cols, rows int, truecolor bool) *Canvas {
	c := &Canvas{W: cols, H: rows * 2, truecolor: truecolor}
	c.px = make([]RGB, c.W*c.H)
	c.overlay = make([]overlayCell, cols*rows)
	return c
}

func (c *Canvas) Set(x, y int, col RGB) {
	if x < 0 || y < 0 || x >= c.W || y >= c.H {
		return
	}
	c.px[y*c.W+x] = col
}

func (c *Canvas) Get(x, y int) RGB {
	if x < 0 || y < 0 || x >= c.W || y >= c.H {
		return pVellum
	}
	return c.px[y*c.W+x]
}

// Blend mixes col over the existing pixel by alpha.
func (c *Canvas) Blend(x, y int, col RGB, alpha float64) {
	if x < 0 || y < 0 || x >= c.W || y >= c.H {
		return
	}
	c.px[y*c.W+x] = lerpRGB(c.px[y*c.W+x], col, alpha)
}

func (c *Canvas) ClearOverlay() {
	for i := range c.overlay {
		c.overlay[i] = overlayCell{}
	}
}

// SetCell places a text rune at cell coordinates, drawn over the pixels.
func (c *Canvas) SetCell(col, row int, r rune, fg RGB) {
	rows := c.H / 2
	if col < 0 || row < 0 || col >= c.W || row >= rows {
		return
	}
	c.overlay[row*c.W+col] = overlayCell{set: true, r: r, fg: fg}
}

// SetText writes a string of cells starting at (col,row).
func (c *Canvas) SetText(col, row int, s string, fg RGB) {
	i := 0
	for _, r := range s {
		c.SetCell(col+i, row, r, fg)
		i++
	}
}

// SetTextV writes a string vertically, one rune per row — toponyms on old
// charts march perpendicular to the coast, on the land side.
func (c *Canvas) SetTextV(col, row int, s string, fg RGB) {
	i := 0
	for _, r := range s {
		c.SetCell(col, row+i, r, fg)
		i++
	}
}

func (c *Canvas) writeFG(b *strings.Builder, col RGB) {
	if c.truecolor {
		b.WriteString("\x1b[38;2;")
		b.WriteString(strconv.Itoa(int(col.R)))
		b.WriteByte(';')
		b.WriteString(strconv.Itoa(int(col.G)))
		b.WriteByte(';')
		b.WriteString(strconv.Itoa(int(col.B)))
		b.WriteByte('m')
	} else {
		b.WriteString("\x1b[38;5;")
		b.WriteString(strconv.Itoa(to256(col)))
		b.WriteByte('m')
	}
}

func (c *Canvas) writeBG(b *strings.Builder, col RGB) {
	if c.truecolor {
		b.WriteString("\x1b[48;2;")
		b.WriteString(strconv.Itoa(int(col.R)))
		b.WriteByte(';')
		b.WriteString(strconv.Itoa(int(col.G)))
		b.WriteByte(';')
		b.WriteString(strconv.Itoa(int(col.B)))
		b.WriteByte('m')
	} else {
		b.WriteString("\x1b[48;5;")
		b.WriteString(strconv.Itoa(to256(col)))
		b.WriteByte('m')
	}
}

// Render emits the framebuffer as half-block cells with minimal SGR churn.
func (c *Canvas) Render() string {
	var b strings.Builder
	b.Grow(c.W * c.H * 8)
	rows := c.H / 2
	for row := 0; row < rows; row++ {
		var haveFG, haveBG bool
		var curFG, curBG RGB
		for x := 0; x < c.W; x++ {
			top := c.px[(row*2)*c.W+x]
			bot := c.px[(row*2+1)*c.W+x]
			o := c.overlay[row*c.W+x]
			var fg, bg RGB
			var glyph rune
			if o.set {
				fg = o.fg
				bg = lerpRGB(top, bot, 0.5)
				glyph = o.r
			} else if top == bot {
				// solid cell: space with bg only — fewer SGR bytes
				fg = top
				bg = top
				glyph = ' '
			} else {
				fg = top
				bg = bot
				glyph = '▀'
			}
			if glyph != ' ' && (!haveFG || fg != curFG) {
				c.writeFG(&b, fg)
				curFG, haveFG = fg, true
			}
			if !haveBG || bg != curBG {
				c.writeBG(&b, bg)
				curBG, haveBG = bg, true
			}
			b.WriteRune(glyph)
		}
		b.WriteString("\x1b[0m")
		if row < rows-1 {
			b.WriteByte('\n')
		}
	}
	return b.String()
}

// ---- pixel drawing helpers -------------------------------------------------

func fillDot(c *Canvas, cx, cy, r float64, col RGB) {
	if r <= 0.6 {
		c.Set(int(cx), int(cy), col)
		return
	}
	ir := int(r + 0.5)
	for dy := -ir; dy <= ir; dy++ {
		for dx := -ir; dx <= ir; dx++ {
			if float64(dx*dx+dy*dy) <= r*r {
				c.Set(int(cx)+dx, int(cy)+dy, col)
			}
		}
	}
}

// blendDot blends a soft dot — thick ink strokes without hard stairsteps.
func blendDot(c *Canvas, cx, cy, r float64, col RGB, alpha float64) {
	if r <= 0.6 {
		c.Blend(int(cx), int(cy), col, alpha)
		return
	}
	ir := int(r + 0.5)
	for dy := -ir; dy <= ir; dy++ {
		for dx := -ir; dx <= ir; dx++ {
			d := math.Sqrt(float64(dx*dx + dy*dy))
			if d <= r {
				c.Blend(int(cx)+dx, int(cy)+dy, col, alpha*clamp01(1.2-(d/r)))
			}
		}
	}
}

// drawStroke blends an ink line from (x0,y0) to (x1,y1). dashOn/dashOff in
// pixels; dashOff 0 means solid. width is the stroke radius.
func drawStroke(c *Canvas, x0, y0, x1, y1 float64, col RGB, alpha, width float64, dashOn, dashOff int) {
	dx, dy := x1-x0, y1-y0
	dist := math.Hypot(dx, dy)
	if dist < 0.5 {
		return
	}
	steps := int(dist) + 1
	period := dashOn + dashOff
	for i := 0; i <= steps; i++ {
		if period > 0 && dashOff > 0 && (i%period) >= dashOn {
			continue
		}
		t := float64(i) / float64(steps)
		blendDot(c, x0+dx*t, y0+dy*t, width, col, alpha)
	}
}

// drawRay blends a stroke of given length from (cx,cy) at angle a, where
// 0 = north/up and positive angles turn clockwise.
func drawRay(c *Canvas, cx, cy, a, from, length float64, col RGB, alpha, width float64, dashOn, dashOff int) {
	sx, sy := math.Sin(a), -math.Cos(a)
	drawStroke(c,
		cx+sx*from, cy+sy*from,
		cx+sx*(from+length), cy+sy*(from+length),
		col, alpha, width, dashOn, dashOff)
}

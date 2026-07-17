package main

// wave.go — half-block pixel canvas + procedural aizuri-e Great Wave.
//
// Each terminal cell renders two vertical pixels: fg = top pixel (▀ glyph),
// bg = bottom pixel. A 120x40 terminal becomes a 120x80 pixel framebuffer.
//
// The wave is procedural: parallax swell layers, a skewed crest bump whose
// barrel is carved out of the body (giving a true overhanging lip), claw
// foam fingers hanging from the lip, dithered foam, and falling spray.

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

// rampAt samples a discrete color ramp — quantized steps keep the flat inked
// regions of a woodblock print and create long SGR runs (bandwidth).
func rampAt(ramp []RGB, t float64) RGB {
	if t <= 0 {
		return ramp[0]
	}
	if t >= 1 {
		return ramp[len(ramp)-1]
	}
	return ramp[int(t*float64(len(ramp)))]
}

// makeRamp builds n quantized steps between anchor colors.
func makeRamp(n int, anchors ...RGB) []RGB {
	out := make([]RGB, n)
	segs := len(anchors) - 1
	for i := 0; i < n; i++ {
		t := float64(i) / float64(n-1)
		f := t * float64(segs)
		s := int(f)
		if s >= segs {
			s = segs - 1
		}
		out[i] = lerpRGB(anchors[s], anchors[s+1], f-float64(s))
	}
	return out
}

// hash noise in [0,1), deterministic per (x, y, seed).
func noise(x, y, seed int) float64 {
	h := uint32(x)*374761393 + uint32(y)*668265263 + uint32(seed)*2246822519
	h ^= h >> 13
	h *= 1274126177
	h ^= h >> 16
	return float64(h) / float64(math.MaxUint32)
}

// ---- ansi 256 quantization -------------------------------------------------

func to256(c RGB) int {
	// grayscale ramp candidate
	r, g, b := int(c.R), int(c.G), int(c.B)
	// 6x6x6 cube
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
		return pInk
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

// ---- wave scene --------------------------------------------------------------

type particle struct {
	x, y, vx, vy float64
	life, ttl    float64
}

// SceneLayout frames the composition for a given canvas: the intro uses a
// tall sky (banner space); the ambient band under the menu compresses it.
type SceneLayout struct {
	Horizon  float64 // far-swell baseline, fraction of H
	MidBase  float64
	NearBase float64
	CrestX   float64 // crest x, fraction of W
	CrestAmp float64 // crest bump amplitude, fraction of H
	FujiX    float64
	FujiH    float64 // fraction of H
	Fuji     bool
}

var introLayout = SceneLayout{
	Horizon: 0.60, MidBase: 0.71, NearBase: 0.90,
	CrestX: 0.30, CrestAmp: 0.40,
	FujiX: 0.685, FujiH: 0.115, Fuji: true,
}

var bandLayout = SceneLayout{
	Horizon: 0.30, MidBase: 0.55, NearBase: 0.86,
	CrestX: 0.26, CrestAmp: 0.42,
	FujiX: 0.72, FujiH: 0.30, Fuji: true,
}

// WaveScene owns time, springs and particles; Draw is pure w.r.t. layout.
type WaveScene struct {
	T         float64
	Rise      float64 // 0 below frame → 1 fully risen (harmonica-driven)
	Calm      float64 // 0 full drama → 1 quiet ambient loop
	particles []particle
	seed      int
	frame     int
}

// color ramps (built once)
var (
	skyRamp  = makeRamp(6, pInkTop, pInk)
	farRamp  = makeRamp(4, RGB{0x19, 0x26, 0x3E}, pSurface)
	midRamp  = makeRamp(5, pAsagiDeep, pSurface2)
	nearRamp = makeRamp(8, pAsagiLight, pAsagiHigh, pAsagi, pSurface2, pSurface)
	foamCol  = pWashi
)

func (s *WaveScene) Update(dt float64) {
	s.T += dt
	s.frame++
	// particles
	alive := s.particles[:0]
	for _, p := range s.particles {
		p.life += dt
		p.vy += 26 * dt // gravity, px/s^2
		p.x += p.vx * dt
		p.y += p.vy * dt
		if p.life < p.ttl {
			alive = append(alive, p)
		}
	}
	s.particles = alive
}

func (s *WaveScene) spawnSpray(x, y float64, n int) {
	for i := 0; i < n; i++ {
		r1 := noise(s.frame, i*3, 11)
		r2 := noise(s.frame, i*3+1, 23)
		r3 := noise(s.frame, i*3+2, 37)
		s.particles = append(s.particles, particle{
			x: x + (r1-0.5)*4, y: y + (r2-0.5)*3,
			vx: 5 + r1*11, vy: -7 + r3*6,
			ttl: 0.9 + r2*1.1,
		})
	}
}

// Draw renders the full scene into the canvas pixels.
func (s *WaveScene) Draw(c *Canvas, lay SceneLayout) {
	W := float64(c.W)
	H := float64(c.H)
	drop := (1 - s.Rise) * H * 0.55
	crest := s.Rise * (1 - 0.38*s.Calm) * (1 + 0.035*math.Sin(0.7*s.T))
	amp := 1 - 0.45*s.Calm // swell amplitude damping when ambient

	// --- sky (continuous per-row gradient: no banding) -----------------------
	for y := 0; y < c.H; y++ {
		t := float64(y) / H
		row := c.px[y*c.W : y*c.W+c.W]
		for x := range row {
			// tiny stable dither breaks gradient banding (premium grain)
			row[x] = lerpRGB(pInkTop, pInk, clamp01(t+(noise(x, y, 71)-0.5)*0.05))
		}
	}

	// --- distant Fuji ----------------------------------------------------------
	horizonY := lay.Horizon*H + drop*0.35
	if lay.Fuji {
		fh := lay.FujiH * H
		apexY := horizonY - fh
		halfW := fh * 2.9
		fx := lay.FujiX * W
		for y := int(apexY); y < int(horizonY)+1; y++ {
			fy := (float64(y) - apexY) / fh // 0 apex → 1 base
			if fy < 0 {
				continue
			}
			hw := 0.8 + halfW*math.Pow(fy, 1.35) // concave woodblock slopes
			col := pFuji
			if fy < 0.34 { // snow cap
				col = lerpRGB(pFuji, pWashi, 0.75*(1-fy/0.34)+0.12)
			}
			for x := int(fx - hw); x <= int(fx+hw); x++ {
				c.Set(x, y, col)
			}
		}
	}

	// --- far swells ------------------------------------------------------------
	for x := 0; x < c.W; x++ {
		fx := float64(x)
		ys := horizonY +
			amp*1.9*math.Sin(0.045*fx+0.35*s.T) +
			amp*1.3*math.Sin(0.021*fx-0.22*s.T+1.7)
		for y := int(ys); y < c.H; y++ {
			d := (float64(y) - ys) / (H * 0.28)
			c.Set(x, y, rampAt(farRamp, d))
		}
		// sparse far foam, jittered off the exact surface line
		if noise(x, s.frame/3, 5) > 0.94+0.04*s.Calm {
			jy := int(ys) + int(noise(x, 0, 51)*3) - 1
			c.Set(x, jy, lerpRGB(pAsagiLight, pWashi, 0.4))
		}
	}

	// --- mid wave ----------------------------------------------------------------
	for x := 0; x < c.W; x++ {
		fx := float64(x)
		ys := lay.MidBase*H + drop*0.7 +
			amp*3.4*math.Sin(0.030*fx-0.50*s.T+0.6) +
			amp*2.1*math.Sin(0.016*fx+0.31*s.T)
		for y := int(ys); y < c.H; y++ {
			d := (float64(y) - ys) / (H * 0.30)
			c.Set(x, y, rampAt(midRamp, d))
		}
		if noise(x, s.frame/3, 9) > 0.92+0.05*s.Calm {
			jy := int(ys) + int(noise(x, 1, 53)*3) - 1
			c.Set(x, jy, lerpRGB(pAsagiLight, pWashi, 0.55))
			c.Set(x, jy-1, lerpRGB(pAsagi, pWashi, 0.3))
		}
	}

	// --- near wave: body with skewed crest bump ---------------------------------
	pre := make([]RGB, len(c.px))
	copy(pre, c.px)

	A := lay.CrestAmp * H * crest
	xc := lay.CrestX * W
	wL := 0.34 * W // long rolling back slope
	wR := 0.17 * W // steep concave face falling into the trough

	surface := make([]float64, c.W)
	var yTop float64 = math.Inf(1)
	for x := 0; x < c.W; x++ {
		fx := float64(x)
		base := lay.NearBase*H + drop +
			amp*4.4*math.Sin(0.026*fx+0.60*s.T+2.1) +
			amp*2.7*math.Sin(0.012*fx-0.40*s.T)
		w := wR
		if fx < xc {
			w = wL
		}
		dxn := math.Abs(fx-xc) / w
		bump := A * math.Exp(-dxn*1.6) // pointed peak, concave sweeping slopes
		ys := base - bump
		surface[x] = ys
		if ys < yTop {
			yTop = ys
		}
		for y := int(ys); y < c.H; y++ {
			d := (float64(y) - ys) / (H * 0.42)
			// crest region lightens toward the surface
			light := bump / (A + 0.001)
			col := rampAt(nearRamp, clamp01(0.16+d-0.20*light))
			// woodblock contour line following the surface, crest zone only
			if light > 0.12 && int(float64(y)-ys)%9 == 8 {
				col = lerpRGB(col, pSurface2, 0.35)
			}
			c.Set(x, y, col)
		}
	}

	// --- the claw: churned hollow + overhanging lip arc + foam fingers ----------
	rh := A * 0.38
	if rh > 3 {
		cx := xc + rh*0.80
		cy := yTop + rh*1.25

		// 1) churned concave face inside the curl, carved from the body only
		rc := rh * 0.86
		x0, x1 := int(cx-rc)-1, int(cx+rc)+2
		y0, y1 := int(cy-rc)-1, int(cy+rc)+2
		for y := y0; y <= y1; y++ {
			for x := x0; x <= x1; x++ {
				if x < 0 || y < 0 || x >= c.W || y >= c.H {
					continue
				}
				ddx := float64(x) - cx
				ddy := float64(y) - cy
				dd := math.Sqrt(ddx*ddx + ddy*ddy)
				if dd >= rc {
					continue
				}
				d2 := dd / rc
				ang := math.Atan2(-ddy, ddx)
				face := lerpRGB(pAsagiHigh, pAsagi, clamp01(0.50+0.50*d2))
				// a few long foam streaks dragged around the curl, near the rim
				if d2 > 0.42 {
					v := d2*1.4 - ang*0.30 + 0.20*s.T
					if f := v - math.Floor(v); f < 0.16 {
						n := noise(x, y, 13)
						face = lerpRGB(face, foamCol, (0.25+0.40*n)*clamp01((d2-0.42)/0.3))
					}
				}
				// feather the rim so the churn melts into the body
				alpha := 0.92 * clamp01((1-d2)*4)
				c.Blend(x, y, face, alpha)
			}
		}

		// 2) the lip: a thick spiral stroke that overhangs the face,
		//    asagi-light on the inside, washi foam on its outer edge
		steps := int(rh * 6)
		for k := 0; k <= steps; k++ {
			u := float64(k) / float64(steps) // 0 crest top → 1 hook tip
			th := 2.30 - u*2.90              // radians, y-up
			r := rh * (1 - 0.14*u)
			px := cx + r*math.Cos(th)
			py := cy - r*math.Sin(th)
			taper := 0.0
			if u > 0.3 {
				taper = (u - 0.3) / 0.7
			}
			thick := rh * (0.30 - 0.22*taper)
			if thick < 0.7 {
				thick = 0.7
			}
			fillDot(c, px, py, thick, pAsagiLight)
			// outer foam edge
			ox := cx + (r+thick*0.7)*math.Cos(th)
			oy := cy - (r+thick*0.7)*math.Sin(th)
			n := noise(k, s.frame/3, 29)
			fillDot(c, ox, oy, thick*(0.6-0.25*taper)+0.4, lerpRGB(pAsagiLight, foamCol, 0.55+0.45*n))
		}

		// 3) claw fingers hanging from the lip's underside
		fingers := 6
		for i := 0; i < fingers; i++ {
			fi := float64(i) / float64(fingers-1)
			th0 := 0.85 - fi*1.30 // along the overhanging leading edge
			th0 += 0.13 * math.Sin(0.9*s.T+float64(i)*1.7)
			ln := 0.60 + 0.30*noise(i, s.frame/6, 41)
			fsteps := int(rh)
			if fsteps < 6 {
				fsteps = 6
			}
			for k := 0; k <= fsteps; k++ {
				u := float64(k) / float64(fsteps) * ln
				if u > 1 {
					break
				}
				// hang from the lip's outer edge, hooking down into the dark
				r := rh * (1.04 - 0.34*u)
				th := th0 - u*1.00
				px := cx + r*math.Cos(th)
				py := cy - r*math.Sin(th)
				thick := (1-u)*1.6 + 0.3
				fillDot(c, px, py, thick, foamCol)
			}
		}

		// 4) spray shed from the hook tip
		if s.Rise > 0.65 && s.frame%2 == 0 {
			n := 2
			if s.Calm > 0.5 {
				n = 1
			}
			tipTh := 2.00 - 2.55
			tipX := cx + rh*0.86*math.Cos(tipTh)
			tipY := cy - rh*0.86*math.Sin(tipTh)
			s.spawnSpray(tipX, tipY, n)
		}
	}

	// --- crest-line foam along the whole near surface -----------------------------
	for x := 0; x < c.W; x++ {
		fx := float64(x)
		w := wR
		if fx < xc {
			w = wL
		}
		dxn := (fx - xc) / w
		density := (0.55*math.Exp(-dxn*dxn*2.2) + 0.06) * (1 - 0.5*s.Calm)
		if noise(x, s.frame/2, 17) < density {
			ys := int(surface[x])
			c.Set(x, ys, foamCol)
			if noise(x, s.frame/2, 19) < density*0.6 {
				c.Set(x, ys-1, lerpRGB(pAsagiLight, foamCol, 0.6))
			}
		}
	}

	// --- spray particles ------------------------------------------------------------
	for _, p := range s.particles {
		fade := 1 - p.life/p.ttl
		col := lerpRGB(pAsagi, foamCol, fade)
		c.Set(int(p.x), int(p.y), col)
	}
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

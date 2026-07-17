package main

// chart.go — the living portolan chart.
//
// The terminal is the vellum. The scene layers, bottom to top: candlelit
// parchment with foxing stains, the 32-wind rhumb network in the historical
// three-color convention (8 principal winds in gall ink, 8 half-winds in
// verdigris, 16 quarter-winds in minium red, dotted), secondary node roses,
// the coast of Terra Opceani with engraved water-lining, soundings, toponyms,
// the compass rose, the ship on her dotted route, and — rarely — a sea
// serpent in the HIC SVNT LEONES quadrant.

import (
	"math"
)

// ChartLayout frames the composition: the intro uses the full chart; the
// ambient band under the menu keeps a compressed strip of it alive.
type ChartLayout struct {
	RoseX, RoseY float64 // rose center, fractions of W / H
	RoseR        float64 // rose radius, fraction of H
	CoastX       float64 // base coastline x, fraction of W
	RouteY       float64 // band: horizontal route line, fraction of H (0 = coastal route)
	Nodes        bool    // secondary node roses on the hidden circle
	Monster      bool
	Soundings    bool
	Labels       bool // sea name, land name, ports, scale bar
	Initials     bool // wind initials around the rose
}

var introChartLayout = ChartLayout{
	RoseX: 0.30, RoseY: 0.62, RoseR: 0.24,
	CoastX: 0.80,
	Monster: true, Soundings: true, Labels: true, Initials: true,
}

var bandChartLayout = ChartLayout{
	RoseX: 0.09, RoseY: 0.52, RoseR: 0.38,
	CoastX: 0.90, RouteY: 0.58,
}

// ports along the coast — the first models of the ledger, moored as harbors.
type port struct {
	name string
	y    float64 // fraction of H along the coast (intro layout)
	x    float64 // fraction of W along the route (band layout)
}

var ports = []port{
	{"yuuki rxg", 0.40, 0.22},
	{"yumo", 0.51, 0.37},
	{"tsuki", 0.62, 0.52},
	{"yaki", 0.73, 0.67},
	{"owo", 0.84, 0.80},
}

type sounding struct {
	x, y float64
	v    string
}

var soundings = []sounding{
	{0.47, 0.40, "7"}, {0.54, 0.56, "5"}, {0.61, 0.66, "9"},
	{0.69, 0.42, "12"}, {0.53, 0.86, "4"}, {0.71, 0.80, "6"},
}

// ChartScene owns time and every animated actor; Draw is pure w.r.t. layout.
type ChartScene struct {
	T      float64
	Reveal float64 // 0 blank vellum → 1 fully inked (intro choreography)
	Calm   float64 // 0 intro drama → 1 quiet ambient loop
	frame  int
	seed   int

	SelPort    int
	ShipTarget float64 // 0..1 along the route
	shipU      float64

	monsterClock float64
}

func (s *ChartScene) Update(dt float64) {
	s.T += dt
	s.frame++
	s.shipU += (s.ShipTarget - s.shipU) * math.Min(1, 1.6*dt)
	s.monsterClock += dt
}

// coastAt returns the coastline x in pixels for a pixel row y.
func coastAt(lay ChartLayout, W float64, y int) float64 {
	fy := float64(y)
	return W*lay.CoastX +
		W*(0.040*math.Sin(0.055*fy+1.0)+0.024*math.Sin(0.11*fy+2.6)) +
		(valueNoise(fy*0.25, 3.3, 17)-0.5)*W*0.02
}

// Draw renders the full chart into the canvas.
func (s *ChartScene) Draw(c *Canvas, lay ChartLayout) {
	W := float64(c.W)
	H := float64(c.H)
	rev := s.Reveal

	s.drawParchment(c)

	rx := lay.RoseX * W
	ry := lay.RoseY * H
	R := lay.RoseR * H

	s.drawRhumbs(c, rx, ry, R, rev)
	if lay.Nodes {
		s.drawNodeRoses(c, rx, ry, rev)
	}
	s.drawCoast(c, lay, rev)
	if lay.Labels {
		s.drawIsland(c, rev)
	}
	if lay.Soundings && rev > 0.66 {
		fg := lerpRGB(pVellum, pAzurite, 0.75*stage(rev, 0.66, 0.85))
		for _, sd := range soundings {
			c.SetText(int(sd.x*W), int(sd.y*H)/2, sd.v, fg)
		}
	}
	if lay.Monster {
		s.drawMonster(c, 0.11*W, 0.22*H, rev)
	}
	if lay.Labels {
		s.drawLabels(c, lay, rev)
	}
	s.drawRose(c, rx, ry, R, lay)
	if lay.RouteY > 0 {
		s.drawBandRoute(c, lay)
	} else if lay.Labels {
		s.drawCoastalShip(c, lay, rev)
	}
}

// ---- parchment --------------------------------------------------------------

// drawParchment paints candlelit vellum: a warm highlight off-center, a
// darkening vignette, stable grain, and slow foxing blotches. The candle
// flickers by a hair — you should feel it, not see it.
func (s *ChartScene) drawParchment(c *Canvas) {
	W := float64(c.W)
	H := float64(c.H)
	flick := 0.030*math.Sin(2.3*s.T) + 0.045*(valueNoise(s.T*1.7, 0.5, 91)-0.5)
	for y := 0; y < c.H; y++ {
		ny := float64(y) / H
		row := c.px[y*c.W : y*c.W+c.W]
		for x := range row {
			nx := float64(x) / W
			dx := (nx - 0.42) * 1.15
			dy := ny - 0.40
			vign := clamp01(math.Sqrt(dx*dx+dy*dy)*1.25 - 0.10)
			t := vign * (0.60 + flick)
			t += (noise(x, y, 71) - 0.5) * 0.09
			col := lerpRGB(pVellumHi, pVellumLo, clamp01(t))
			b := valueNoise(float64(x)*0.09, float64(y)*0.09, 33)
			if b > 0.72 {
				col = lerpRGB(col, pFoxing, (b-0.72)/0.28*0.45)
			}
			row[x] = col
		}
	}
}

// ---- rhumb network -----------------------------------------------------------

// drawRhumbs inks the 32-wind network in drafting order — the historical
// three-color convention, replayed: gall-ink principals first, verdigris
// half-winds, then the dotted minium quarter-winds.
func (s *ChartScene) drawRhumbs(c *Canvas, rx, ry, R float64, rev float64) {
	maxLen := math.Hypot(float64(c.W), float64(c.H))
	stP := stage(rev, 0.10, 0.34)
	stH := stage(rev, 0.22, 0.48)
	stQ := stage(rev, 0.34, 0.62)
	from := R * 0.30
	for k := 0; k < 32; k++ {
		a := float64(k) * math.Pi / 16
		var col RGB
		var alpha, wid, st float64
		var don, doff int
		switch {
		case k%4 == 0: // 8 principal winds
			col, alpha, wid, st = pSepia, 0.38, 0.6, stP
			don, doff = 1, 0
		case k%2 == 0: // 8 half-winds
			col, alpha, wid, st = pVerdigris, 0.30, 0.6, stH
			don, doff = 1, 0
		default: // 16 quarter-winds, finely dotted
			col, alpha, wid, st = pMinio, 0.22, 0.5, stQ
			don, doff = 1, 3
		}
		if st <= 0 {
			continue
		}
		drawRay(c, rx, ry, a, from, (maxLen-from)*st, col, alpha, wid, don, doff)
	}
}

// drawNodeRoses places small 8-wind stars on the hidden construction
// circle — the mesh texture of a real portolan, kept crisp: an empty
// center, a thin ring, short rays.
func (s *ChartScene) drawNodeRoses(c *Canvas, rx, ry float64, rev float64) {
	st := stage(rev, 0.45, 0.68)
	if st <= 0 {
		return
	}
	W := float64(c.W)
	rc := 0.34 * W
	for _, na := range []float64{1.05, 2.5, 3.85} {
		nx := rx + rc*math.Sin(na)
		ny := ry - rc*math.Cos(na)
		if nx < 2 || nx >= W-2 || ny < 2 || ny >= float64(c.H)-2 {
			continue
		}
		circle(c, nx, ny, 0.020*W, pSepia, 0.30*st)
		for k := 0; k < 8; k++ {
			a := float64(k) * math.Pi / 4
			drawRay(c, nx, ny, a, 2.8, 0.042*W*st, pSepia, 0.22, 0.5, 1, 0)
		}
	}
}

// ---- coast -------------------------------------------------------------------

// drawCoast reveals Terra Opceani north to south: hatched land, a gall-ink
// coastline, and engraved water-lining — parallel azurite waves hugging the
// shore, breathing slightly, the way the burin left them.
func (s *ChartScene) drawCoast(c *Canvas, lay ChartLayout, rev float64) {
	W := float64(c.W)
	yMax := int(float64(c.H) * stage(rev, 0.30, 0.60))
	for y := 0; y < yMax; y++ {
		cx := coastAt(lay, W, y)
		icx := int(cx)
		for x := icx + 1; x < c.W; x++ {
			col := lerpRGB(c.Get(x, y), pVellumLo, 0.45)
			if (x+2*y)%7 == 0 {
				col = lerpRGB(col, pSepiaSoft, 0.20)
			}
			c.Set(x, y, col)
		}
		c.Blend(icx, y, pSepia, 0.85)
		c.Blend(icx+1, y, pSepia, 0.45)
		for k := 1; k <= 3; k++ {
			wob := math.Sin(0.13*float64(y)+s.T*0.6+float64(k)*1.9) * 1.5
			wx := int(cx - float64(k)*3.4 + wob)
			c.Blend(wx, y, pAzurite, 0.28-0.07*float64(k))
		}
		if noise(y, 2, 63) > 0.74 {
			sx := icx - 5 - int(noise(y, 1, 62)*9)
			c.Blend(sx, y, pAzurite, 0.22)
		}
	}
}

// drawIsland inks a small wobbled island in the northern sea.
func (s *ChartScene) drawIsland(c *Canvas, rev float64) {
	st := stage(rev, 0.50, 0.70)
	if st <= 0 {
		return
	}
	W := float64(c.W)
	H := float64(c.H)
	ix, iy := 0.60*W, 0.78*H
	ir := 0.045 * H
	span := int(ir*1.6) + 2
	for dy := -span; dy <= span; dy++ {
		for dx := -span * 2; dx <= span*2; dx++ {
			fx, fy := float64(dx), float64(dy)
			d := math.Hypot(fx*0.62, fy)
			ang := math.Atan2(fy, fx)
			rr := ir * (1 + 0.28*math.Sin(3*ang+1.2) + 0.14*math.Sin(5*ang)) * st
			if d < rr {
				col := lerpRGB(c.Get(int(ix)+dx, int(iy)+dy), pVellumLo, 0.5)
				if (dx+2*dy)%5 == 0 {
					col = lerpRGB(col, pSepiaSoft, 0.22)
				}
				c.Set(int(ix)+dx, int(iy)+dy, col)
			} else if d < rr+1.3 {
				c.Blend(int(ix)+dx, int(iy)+dy, pSepia, 0.6*st)
			}
		}
	}
}

// ---- labels ------------------------------------------------------------------

// drawLabels writes the chart's voice: the sea name in spaced capitals, the
// land name down the coast, harbor toponyms, the leones warning, and the
// tronco de leguas — every V where a U would be is on purpose.
func (s *ChartScene) drawLabels(c *Canvas, lay ChartLayout, rev float64) {
	W := float64(c.W)
	H := float64(c.H)
	rows := c.H / 2

	// sea name, letterspaced across open water
	if st := stage(rev, 0.72, 0.92); st > 0 {
		sea := "O C E A N V S   O P C E A N I"
		fg := lerpRGB(pVellum, pSepiaSoft, 0.85*st)
		c.SetText(int(0.58*W)-len(sea)/2, int(0.50*float64(rows)), sea, fg)
	}

	// land name, vertical down the coast
	if st := stage(rev, 0.64, 0.84); st > 0 {
		fg := lerpRGB(pVellum, pFoxing, 0.95*st)
		col := int(coastAt(lay, W, int(0.25*H))) + 8
		c.SetTextV(col, int(0.08*float64(rows)), "TERRA OPCEANI", fg)
	}

	// harbor toponyms on the land side, moorings on the sea side
	if st := stage(rev, 0.70, 0.90); st > 0 {
		for i, p := range ports {
			py := int(p.y * H)
			row := py / 2
			cx := int(coastAt(lay, W, py))
			mark, fg := '○', lerpRGB(pVellum, pSepia, 0.9*st)
			if i == s.SelPort {
				mark, fg = '●', lerpRGB(pVellum, pMinio, st)
			}
			c.SetCell(cx-3, row, mark, fg)
			c.SetText(cx+2, row, p.name, fg)
		}
	}

	// the warning in the empty quadrant
	if st := stage(rev, 0.80, 0.98); st > 0 {
		fg := lerpRGB(pVellum, pSepiaSoft, 0.75*st)
		c.SetText(int(0.045*W), int(0.13*float64(rows)), "HIC SVNT LEONES", fg)
	}

	// tronco de leguas, bottom left
	if st := stage(rev, 0.76, 0.94); st > 0 {
		bx := int(0.05 * W)
		by := int(0.93 * H)
		segW := 5
		for i := 0; i < 8; i++ {
			x0 := bx + i*segW
			for x := x0; x < x0+segW; x++ {
				c.Blend(x, by, pSepia, 0.8*st)
				c.Blend(x, by+2, pSepia, 0.8*st)
				if i%2 == 0 {
					c.Blend(x, by+1, pSepia, 0.75*st)
				}
			}
			c.Blend(x0, by+1, pSepia, 0.8*st)
		}
		c.Blend(bx+8*segW, by, pSepia, 0.8*st)
		c.Blend(bx+8*segW, by+1, pSepia, 0.8*st)
		c.Blend(bx+8*segW, by+2, pSepia, 0.8*st)
		fg := lerpRGB(pVellum, pSepiaSoft, 0.9*st)
		c.SetText(bx, by/2-1, "L E G V A S", fg)
	}
}

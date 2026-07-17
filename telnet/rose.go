package main

// rose.go — the compass rose and her needle.
//
// A 32-point rose in the Reinel tradition: fleur-de-lis at north, a cross
// toward the Levant, gold on the cardinals, gall ink on the intercardinals,
// verdigris half-winds, minium quarter-winds. The needle is released during
// the intro, overshoots north and settles in a damped oscillation; in the
// ambient loop it keeps a sailor's sway.

import "math"

// circle blends a thin circle outline.
func circle(c *Canvas, cx, cy, r float64, col RGB, alpha float64) {
	steps := int(2*math.Pi*r) * 2
	if steps < 12 {
		steps = 12
	}
	for i := 0; i < steps; i++ {
		a := float64(i) / float64(steps) * 2 * math.Pi
		c.Blend(int(cx+r*math.Sin(a)), int(cy-r*math.Cos(a)), col, alpha)
	}
}

// drawTaper blends a rose point: a stroke from radius `from` outward whose
// width tapers to a tip — the empty start keeps the hub from muddying.
func drawTaper(c *Canvas, cx, cy, ang, from, length, w0 float64, col RGB, alpha float64) {
	sx, sy := math.Sin(ang), -math.Cos(ang)
	span := length - from
	if span <= 0 {
		return
	}
	steps := int(span) + 1
	for i := 0; i <= steps; i++ {
		u := float64(i) / float64(steps)
		r := from + span*u
		w := w0*(1-u) + 0.3
		blendDot(c, cx+sx*r, cy+sy*r, w, col, alpha)
	}
}

// needleAngle: released at t=2.4s, overshoot and damped settle onto north,
// then a permanent quiet sway.
func (s *ChartScene) needleAngle() float64 {
	nt := s.T - 2.4
	th := 1.1
	if nt >= 0 {
		th = 1.1 * math.Exp(-1.0*nt) * math.Cos(3.6*nt)
	}
	return th + 0.05*math.Sin(0.45*s.T) + 0.03*math.Sin(1.1*s.T+2.0)
}

// drawRose blooms with the reveal, then holds.
func (s *ChartScene) drawRose(c *Canvas, rx, ry, R float64, lay ChartLayout) {
	st := stage(s.Reveal, 0.50, 0.80)
	if st <= 0 {
		return
	}
	R *= 0.6 + 0.4*st

	// rings
	circle(c, rx, ry, R, pGold, 0.55*st)
	circle(c, rx, ry, R*0.93, pSepia, 0.30*st)

	// 32 ring ticks
	for k := 0; k < 32; k++ {
		a := float64(k) * math.Pi / 16
		drawRay(c, rx, ry, a, R*0.93, R*0.07, pSepia, 0.4*st, 0.5, 1, 0)
	}

	// 16 quarter-wind points — minium
	for k := 0; k < 16; k++ {
		a := math.Pi/16 + float64(k)*math.Pi/8
		drawTaper(c, rx, ry, a, R*0.30, R*0.55, 0.7, pMinio, 0.40*st)
	}
	// 8 half-wind points — verdigris
	for k := 0; k < 8; k++ {
		a := math.Pi/8 + float64(k)*math.Pi/4
		drawTaper(c, rx, ry, a, R*0.22, R*0.74, 1.1, pVerdigris, 0.55*st)
	}
	// 8 principal points — gold cardinals, vermilion intercardinals,
	// each on a gall-ink ground
	for k := 0; k < 8; k++ {
		a := float64(k) * math.Pi / 4
		if k%2 == 0 {
			drawTaper(c, rx, ry, a, 0, R*0.98, 2.2, pSepia, 0.55*st)
			drawTaper(c, rx, ry, a, 0, R*0.92, 1.1, pGold, 0.9*st)
		} else {
			drawTaper(c, rx, ry, a, 0, R*0.86, 1.8, pSepia, 0.5*st)
			drawTaper(c, rx, ry, a, 0, R*0.80, 0.8, pVermilion, 0.75*st)
		}
	}

	// needle
	th := s.needleAngle()
	drawTaper(c, rx, ry, th, 0, R*0.74, 1.0, pMinio, 0.9*st)
	drawTaper(c, rx, ry, th+math.Pi, 0, R*0.22, 0.9, pSepia, 0.8*st)

	// hub: a clean vellum wash, gall ink, gold collar, the compass hole
	blendDot(c, rx, ry, 4.0, pVellum, 0.45*st)
	fillDot(c, rx, ry, 2.4, pSepia)
	fillDot(c, rx, ry, 1.2, pGold)
	c.Set(int(rx), int(ry), pVellum)

	// fleur-de-lis at north
	c.SetCell(int(rx), int(ry-R-3)/2, '⚜', lerpRGB(pVellum, pGold, st))

	// wind initials and the Levant cross — the fleur-de-lis stands in for
	// Tramontana, so the T is not written
	if lay.Initials {
		fg := lerpRGB(pVellum, pSepia, 0.85*st)
		initials := []rune{'T', 'G', 'L', 'S', 'O', 'L', 'P', 'M'}
		for k := 1; k < len(initials); k++ {
			a := float64(k) * math.Pi / 4
			col := int(rx + (R+5)*math.Sin(a))
			row := int(ry-(R+5)*math.Cos(a)) / 2
			c.SetCell(col, row, initials[k], fg)
		}
		c.SetCell(int(rx+R+9), int(ry)/2, '✚', lerpRGB(pVellum, pVermilion, 0.8*st))
	}
}

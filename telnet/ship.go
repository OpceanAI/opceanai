package main

// ship.go — the caravel on her dotted minium route, and the serpent.
//
// The route is the genre's signature motion: a red trim-path crawling across
// the chart, ship at its head. The serpent surfaces once in a long while in
// the HIC SVNT LEONES quadrant, coils, breathes, and goes under again.

import "math"

// drawShip inks a small caravel at pixel (sx, sy): dark hull, gall mast,
// a vermilion lateen sail, minium pennant.
func drawShip(c *Canvas, sx, sy float64, alpha float64) {
	// hull
	drawStroke(c, sx-3, sy, sx+3, sy, pInkDark, 0.95*alpha, 0.7, 1, 0)
	drawStroke(c, sx-2, sy+1, sx+2, sy+1, pInkDark, 0.9*alpha, 0.6, 1, 0)
	// mast
	drawStroke(c, sx, sy-1, sx, sy-6, pSepia, 0.9*alpha, 0.5, 1, 0)
	// lateen sail, bellying to starboard
	for i := 0; i <= 4; i++ {
		y := sy - 6 + float64(i)
		w := 0.8 + float64(i)*0.85
		drawStroke(c, sx+0.8, y, sx+0.8+w, y, pVermilion, 0.85*alpha, 0.55, 1, 0)
	}
	// pennant
	c.Blend(int(sx), int(sy-7), pMinio, alpha)
	c.Blend(int(sx+1), int(sy-7), pMinio, 0.7*alpha)
}

// drawCoastalShip sails the intro chart: a dotted route down the coast, the
// traveled leg in minium, the ship easing toward the selected harbor.
func (s *ChartScene) drawCoastalShip(c *Canvas, lay ChartLayout, rev float64) {
	st := stage(rev, 0.74, 0.92)
	if st <= 0 {
		return
	}
	W := float64(c.W)
	H := float64(c.H)
	y0 := ports[0].y * H
	y1 := ports[len(ports)-1].y * H
	off := 0.085 * W

	routeX := func(y float64) float64 {
		return coastAt(lay, W, int(y)) - off
	}

	// full route, faint gall dots
	for y := y0; y <= y1; y += 5 {
		c.Blend(int(routeX(y)), int(y), pSepia, 0.35*st)
	}
	// traveled leg, minium dots
	shipY := lerp(y0, y1, s.shipU)
	for y := y0; y <= shipY; y += 5 {
		c.Blend(int(routeX(y)), int(y), pMinio, 0.8*st)
	}
	drawShip(c, routeX(shipY), shipY, st)
}

// drawBandRoute is the compressed ambient version: a horizontal route with
// the harbors moored along it.
func (s *ChartScene) drawBandRoute(c *Canvas, lay ChartLayout) {
	W := float64(c.W)
	ry := lay.RouteY * float64(c.H)
	x0 := ports[0].x * W
	x1 := ports[len(ports)-1].x * W

	for x := x0; x <= x1; x += 5 {
		c.Blend(int(x), int(ry), pSepia, 0.35)
	}
	shipX := lerp(x0, x1, s.shipU)
	for x := x0; x <= shipX; x += 5 {
		c.Blend(int(x), int(ry), pMinio, 0.8)
	}
	for i, p := range ports {
		mark, fg := '○', pSepia
		if i == s.SelPort {
			mark, fg = '●', pMinio
		}
		c.SetCell(int(p.x*W), int(ry)/2+1, mark, fg)
	}
	drawShip(c, shipX, ry-1, 1)
}

// drawMonster surfaces the serpent: three coils rising under a sine
// envelope, a raised head with a minium eye, a faint spout. Rare on
// purpose — monsters mark the water nobody charted.
func (s *ChartScene) drawMonster(c *Canvas, mx, my float64, rev float64) {
	if rev < 0.9 {
		return
	}
	ph := math.Mod(s.monsterClock, 80)
	if ph < 72 {
		return
	}
	env := math.Sin(math.Pi * (ph - 72) / 8)
	col := lerpRGB(pVerdigris, pSepia, 0.45)
	for i := 0; i < 3; i++ {
		cx := mx + 4 + float64(i)*9
		r := 3.4 - float64(i)*0.5
		steps := 14
		for k := 0; k <= steps; k++ {
			a := float64(k) / float64(steps) * math.Pi
			blendDot(c, cx+r*math.Cos(a), my-r*math.Sin(a)*env, 0.8, col, 0.85*env)
		}
	}
	// head and eye
	hx := mx - 1
	drawStroke(c, hx+1.5, my, hx, my-4.5*env, col, 0.9*env, 0.9, 1, 0)
	c.Blend(int(hx-1), int(my-4.5*env), pMinio, env)
	// spout
	if env > 0.55 {
		a := (env - 0.55) / 0.45
		c.Blend(int(hx-1), int(my-7*env), pAzurite, 0.7*a)
		c.Blend(int(hx), int(my-8*env), pAzurite, 0.5*a)
		c.Blend(int(hx-2), int(my-8*env), pAzurite, 0.4*a)
	}
}

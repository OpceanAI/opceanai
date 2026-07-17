package main

// cartouche.go — the strapwork title frame, drawn as cell overlays.
//
// Double-ruled box glyphs in gold with finials at the midpoints: the pasted
// label every chart carries, sitting above the inked sea.

// washCells fades the pixels under a cell region toward clean vellum — the
// cartouche is a label pasted OVER the inked sea, so the rhumb lines must
// not show through it.
func washCells(c *Canvas, col, row, w, h int, alpha float64) {
	for y := row * 2; y < (row+h)*2; y++ {
		for x := col; x < col+w; x++ {
			c.Blend(x, y, pVellumHi, alpha)
		}
	}
}

// drawCartouche frames a region in cell coordinates (col,row,w,h are cells).
func drawCartouche(c *Canvas, col, row, w, h int, fg RGB) {
	if w < 4 || h < 2 {
		return
	}
	for x := 1; x < w-1; x++ {
		c.SetCell(col+x, row, '═', fg)
		c.SetCell(col+x, row+h-1, '═', fg)
	}
	for y := 1; y < h-1; y++ {
		c.SetCell(col, row+y, '║', fg)
		c.SetCell(col+w-1, row+y, '║', fg)
	}
	c.SetCell(col, row, '╔', fg)
	c.SetCell(col+w-1, row, '╗', fg)
	c.SetCell(col, row+h-1, '╚', fg)
	c.SetCell(col+w-1, row+h-1, '╝', fg)
	// finials
	c.SetCell(col+w/2, row, '✦', fg)
	c.SetCell(col+w/2, row+h-1, '✦', fg)
}

package main

// banner.go — a small hand-drawn 7-row block font for the OPCEANAI wordmark
// and the big research stat. '#' marks filled cells.

import "strings"

var glyphs = map[rune][]string{
	'O': {
		" #### ",
		"##  ##",
		"##  ##",
		"##  ##",
		"##  ##",
		"##  ##",
		" #### ",
	},
	'P': {
		"##### ",
		"##  ##",
		"##  ##",
		"##### ",
		"##    ",
		"##    ",
		"##    ",
	},
	'C': {
		" #####",
		"##    ",
		"##    ",
		"##    ",
		"##    ",
		"##    ",
		" #####",
	},
	'E': {
		"######",
		"##    ",
		"##    ",
		"##### ",
		"##    ",
		"##    ",
		"######",
	},
	'A': {
		" #### ",
		"##  ##",
		"##  ##",
		"######",
		"##  ##",
		"##  ##",
		"##  ##",
	},
	'N': {
		"##   ##",
		"###  ##",
		"#### ##",
		"## ####",
		"##  ###",
		"##   ##",
		"##   ##",
	},
	'I': {
		"######",
		"  ##  ",
		"  ##  ",
		"  ##  ",
		"  ##  ",
		"  ##  ",
		"######",
	},
	'0': {
		" #### ",
		"##  ##",
		"##  ##",
		"##  ##",
		"##  ##",
		"##  ##",
		" #### ",
	},
	'5': {
		"######",
		"##    ",
		"##    ",
		"##### ",
		"    ##",
		"    ##",
		"##### ",
	},
	'6': {
		" #####",
		"##    ",
		"##    ",
		"##### ",
		"##  ##",
		"##  ##",
		" #### ",
	},
	'7': {
		"######",
		"    ##",
		"   ## ",
		"   ## ",
		"  ##  ",
		"  ##  ",
		"  ##  ",
	},
	'.': {
		"  ",
		"  ",
		"  ",
		"  ",
		"  ",
		"##",
		"##",
	},
	'%': {
		"##  ##",
		"##  ##",
		"   ## ",
		"  ##  ",
		" ##   ",
		"##  ##",
		"##  ##",
	},
	'-': {
		"     ",
		"     ",
		"     ",
		"#####",
		"     ",
		"     ",
		"     ",
	},
	' ': {
		"   ",
		"   ",
		"   ",
		"   ",
		"   ",
		"   ",
		"   ",
	},
}

const glyphRows = 7

// bannerLines renders a word into 7 text rows of '#' and ' '.
func bannerLines(word string) []string {
	rows := make([]string, glyphRows)
	first := true
	for _, r := range word {
		g, ok := glyphs[r]
		if !ok {
			continue
		}
		for i := 0; i < glyphRows; i++ {
			if !first {
				rows[i] += " "
			}
			rows[i] += g[i]
		}
		first = false
	}
	return rows
}

// bannerWidth returns the cell width of a rendered word.
func bannerWidth(word string) int {
	l := bannerLines(word)
	if len(l) == 0 {
		return 0
	}
	return len(l[0])
}

// drawBannerCells composites a word onto the canvas as cell overlays.
// reveal in [0,1] progressively uncovers letters left to right, each column
// fading from deep asagi up to washi as the reveal edge passes it.
func drawBannerCells(c *Canvas, word string, col, row int, reveal float64) {
	lines := bannerLines(word)
	if len(lines) == 0 {
		return
	}
	w := len(lines[0])
	edge := reveal * (float64(w) + 12)
	for y, line := range lines {
		for x, ch := range line {
			if ch != '#' {
				continue
			}
			d := edge - float64(x)
			if d <= 0 {
				continue
			}
			a := clamp01(d / 12)
			fg := lerpRGB(pAsagiDeep, pWashi, a)
			c.SetCell(col+x, row+y, '█', fg)
		}
	}
}

// styledBanner renders a word as lipgloss-styled text lines (for the
// research stat inside the content pane).
func styledBanner(word string, th *Theme) string {
	lines := bannerLines(word)
	out := make([]string, len(lines))
	for i, line := range lines {
		var b strings.Builder
		for _, ch := range line {
			if ch == '#' {
				b.WriteRune('█')
			} else {
				b.WriteRune(' ')
			}
		}
		// digits washi, but let the tail glyphs (% etc.) keep the same voice
		out[i] = th.BigDigit.Render(b.String())
	}
	return strings.Join(out, "\n")
}

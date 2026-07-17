package main

// styles.go — the single source of truth for every color in the app.
// Portolan palette: aged vellum canvas, iron-gall sepia ink, minium red
// reserved for EXACTLY one meaning (active selection / the ship's route),
// verdigris and azurite as secondary inks, shell gold only on the rose,
// the cartouche and capitals. No pure black, no pure white — everything
// lives inside the warm brown-gold gamut of a real chart.

import (
	"github.com/charmbracelet/lipgloss"
)

// RGB is a plain truecolor pixel used by the half-block canvas.
type RGB struct{ R, G, B uint8 }

// ---- raw palette (canvas + theme share these) -----------------------------

var (
	pVellum    = RGB{0xEA, 0xD9, 0xB0} // scraped calfskin, lightest zones
	pVellumHi  = RGB{0xF2, 0xE4, 0xC4} // candlelit center highlight
	pVellumLo  = RGB{0xD4, 0xBC, 0x8B} // aged, handled parchment
	pFoxing    = RGB{0xB9, 0x97, 0x5B} // damp stains, edge darkening
	pSepia     = RGB{0x5B, 0x46, 0x36} // faded iron-gall ink (main linework)
	pInkDark   = RGB{0x2E, 0x24, 0x20} // fresh gall ink, warm near-black
	pSepiaSoft = RGB{0x8A, 0x6F, 0x52} // secondary text, worn ink
	pMinio     = RGB{0xC1, 0x44, 0x0E} // red lead — selection & route ONLY
	pVermilion = RGB{0xA9, 0x32, 0x26} // cinnabar, major toponyms
	pVerdigris = RGB{0x5E, 0x7B, 0x5A} // aged copper green, half-winds
	pAzurite   = RGB{0x4A, 0x6D, 0x8C} // sea ink, water-lining
	pIndigo    = RGB{0x31, 0x48, 0x5C} // deep sea wash
	pGold      = RGB{0xC9, 0xA2, 0x27} // shell gold, rose & capitals
	pGoldHi    = RGB{0xE6, 0xC5, 0x68} // burnished leaf catching light
)

// lipgloss complete colors: truecolor + ANSI256 + ANSI fallbacks.
var (
	lcVellum    = lipgloss.CompleteColor{TrueColor: "#EAD9B0", ANSI256: "223", ANSI: "7"}
	lcVellumLo  = lipgloss.CompleteColor{TrueColor: "#D4BC8B", ANSI256: "180", ANSI: "7"}
	lcInkDark   = lipgloss.CompleteColor{TrueColor: "#2E2420", ANSI256: "235", ANSI: "0"}
	lcSepia     = lipgloss.CompleteColor{TrueColor: "#5B4636", ANSI256: "95", ANSI: "0"}
	lcSepiaSoft = lipgloss.CompleteColor{TrueColor: "#8A6F52", ANSI256: "137", ANSI: "3"}
	lcFoxing    = lipgloss.CompleteColor{TrueColor: "#B9975B", ANSI256: "137", ANSI: "3"}
	lcMinio     = lipgloss.CompleteColor{TrueColor: "#C1440E", ANSI256: "166", ANSI: "1"}
	lcVerdigris = lipgloss.CompleteColor{TrueColor: "#5E7B5A", ANSI256: "65", ANSI: "2"}
	lcAzurite   = lipgloss.CompleteColor{TrueColor: "#4A6D8C", ANSI256: "67", ANSI: "4"}
	lcGold      = lipgloss.CompleteColor{TrueColor: "#C9A227", ANSI256: "178", ANSI: "3"}
)

// Theme carries every style used by the views. Zero color literals elsewhere.
type Theme struct {
	R         *lipgloss.Renderer
	Truecolor bool

	// header
	Wordmark    lipgloss.Style
	WordmarkDim lipgloss.Style
	Tab         lipgloss.Style
	TabActive   lipgloss.Style

	// body
	Body      lipgloss.Style
	Secondary lipgloss.Style
	Dim       lipgloss.Style
	Heading   lipgloss.Style
	Pane      lipgloss.Style

	// ledger
	ColHeader   lipgloss.Style
	RowName     lipgloss.Style
	RowNameSel  lipgloss.Style
	RowFocus    lipgloss.Style
	RowFocusSel lipgloss.Style
	SelBar      lipgloss.Style
	StActive    lipgloss.Style
	StExper     lipgloss.Style
	StResearch  lipgloss.Style
	DetailText  lipgloss.Style

	// doki snippet
	SnipBlock  lipgloss.Style
	SnipPrompt lipgloss.Style
	SnipCmd    lipgloss.Style
	SnipOut    lipgloss.Style

	// research
	BigDigit  lipgloss.Style
	BigAccent lipgloss.Style
	StatLabel lipgloss.Style

	// links
	Link lipgloss.Style

	// footer
	Footer    lipgloss.Style
	FooterKey lipgloss.Style

	// misc
	TooSmall lipgloss.Style
	BG       lipgloss.Style
}

// NewTheme builds all styles against a session renderer so color
// degradation follows the client's detected profile.
func NewTheme(r *lipgloss.Renderer, truecolor bool) *Theme {
	bg := func(s lipgloss.Style) lipgloss.Style { return s.Background(lcVellum) }
	t := &Theme{R: r, Truecolor: truecolor}

	t.BG = bg(r.NewStyle())
	t.Wordmark = bg(r.NewStyle()).Foreground(lcInkDark).Bold(true)
	t.WordmarkDim = bg(r.NewStyle()).Foreground(lcSepiaSoft)
	t.Tab = bg(r.NewStyle()).Foreground(lcSepiaSoft)
	t.TabActive = bg(r.NewStyle()).Foreground(lcMinio).Bold(true)

	t.Body = bg(r.NewStyle()).Foreground(lcInkDark)
	t.Secondary = bg(r.NewStyle()).Foreground(lcSepia)
	t.Dim = bg(r.NewStyle()).Foreground(lcSepiaSoft)
	t.Heading = bg(r.NewStyle()).Foreground(lcInkDark).Bold(true)

	t.Pane = bg(r.NewStyle()).
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lcFoxing).
		BorderBackground(lcVellum).
		Padding(1, 3)

	t.ColHeader = bg(r.NewStyle()).Foreground(lcSepiaSoft)
	t.RowName = bg(r.NewStyle()).Foreground(lcInkDark)
	t.RowNameSel = bg(r.NewStyle()).Foreground(lcInkDark).Bold(true)
	t.RowFocus = bg(r.NewStyle()).Foreground(lcSepia)
	t.RowFocusSel = bg(r.NewStyle()).Foreground(lcInkDark)
	t.SelBar = bg(r.NewStyle()).Foreground(lcMinio)
	t.StActive = bg(r.NewStyle()).Foreground(lcVerdigris)
	t.StExper = bg(r.NewStyle()).Foreground(lcSepiaSoft)
	t.StResearch = bg(r.NewStyle()).Foreground(lcAzurite)
	t.DetailText = bg(r.NewStyle()).Foreground(lcSepia).Italic(true)

	t.SnipBlock = r.NewStyle().Background(lcVellumLo).Padding(1, 2)
	t.SnipPrompt = r.NewStyle().Background(lcVellumLo).Foreground(lcAzurite)
	t.SnipCmd = r.NewStyle().Background(lcVellumLo).Foreground(lcInkDark)
	t.SnipOut = r.NewStyle().Background(lcVellumLo).Foreground(lcSepia)

	t.BigDigit = bg(r.NewStyle()).Foreground(lcInkDark)
	t.BigAccent = bg(r.NewStyle()).Foreground(lcMinio)
	t.StatLabel = bg(r.NewStyle()).Foreground(lcSepiaSoft)

	t.Link = bg(r.NewStyle()).Foreground(lcAzurite)

	t.Footer = bg(r.NewStyle()).Foreground(lcSepiaSoft)
	t.FooterKey = bg(r.NewStyle()).Foreground(lcSepia)

	t.TooSmall = bg(r.NewStyle()).Foreground(lcSepia)
	return t
}

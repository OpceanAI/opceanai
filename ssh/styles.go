package main

// styles.go — the single source of truth for every color in the app.
// Aizuri-e palette: deep indigo canvas, asagi mid-blues, washi off-white,
// and vermillion reserved for EXACTLY one meaning: active selection/focus.

import (
	"github.com/charmbracelet/lipgloss"
)

// RGB is a plain truecolor pixel used by the half-block canvas.
type RGB struct{ R, G, B uint8 }

// ---- raw palette (canvas + theme share these) -----------------------------

var (
	pInk        = RGB{0x0D, 0x16, 0x26} // canvas / background
	pInkTop     = RGB{0x0A, 0x11, 0x1E} // sky zenith, slightly darker
	pSurface    = RGB{0x14, 0x20, 0x34} // elevated surface
	pSurface2   = RGB{0x1B, 0x2A, 0x44} // deeper wave body / raised surface
	pAsagiDeep  = RGB{0x2C, 0x43, 0x63} // dark asagi
	pAsagi      = RGB{0x3D, 0x5A, 0x80} // asagi mid indigo
	pAsagiHigh  = RGB{0x5C, 0x7E, 0xA2} // between asagi and asagi-light
	pAsagiLight = RGB{0x7A, 0x9E, 0xBF} // near-crest asagi
	pWashi      = RGB{0xF2, 0xED, 0xE4} // foam / primary text
	pText2      = RGB{0xA8, 0xB8, 0xCC} // secondary text
	pVermilion  = RGB{0xC6, 0x3D, 0x2F} // active selection ONLY
	pFuji       = RGB{0x1A, 0x28, 0x42} // distant mountain silhouette
)

// lipgloss complete colors: truecolor + ANSI256 + ANSI fallbacks.
var (
	lcInk        = lipgloss.CompleteColor{TrueColor: "#0D1626", ANSI256: "234", ANSI: "0"}
	lcSurface    = lipgloss.CompleteColor{TrueColor: "#142034", ANSI256: "235", ANSI: "0"}
	lcSurface2   = lipgloss.CompleteColor{TrueColor: "#1B2A44", ANSI256: "236", ANSI: "4"}
	lcAsagiDeep  = lipgloss.CompleteColor{TrueColor: "#2C4363", ANSI256: "60", ANSI: "4"}
	lcAsagi      = lipgloss.CompleteColor{TrueColor: "#3D5A80", ANSI256: "67", ANSI: "4"}
	lcAsagiLight = lipgloss.CompleteColor{TrueColor: "#7A9EBF", ANSI256: "110", ANSI: "6"}
	lcWashi      = lipgloss.CompleteColor{TrueColor: "#F2EDE4", ANSI256: "255", ANSI: "15"}
	lcText2      = lipgloss.CompleteColor{TrueColor: "#A8B8CC", ANSI256: "146", ANSI: "7"}
	lcVermilion  = lipgloss.CompleteColor{TrueColor: "#C63D2F", ANSI256: "166", ANSI: "1"}
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
	bg := func(s lipgloss.Style) lipgloss.Style { return s.Background(lcInk) }
	t := &Theme{R: r, Truecolor: truecolor}

	t.BG = bg(r.NewStyle())
	t.Wordmark = bg(r.NewStyle()).Foreground(lcWashi).Bold(true)
	t.WordmarkDim = bg(r.NewStyle()).Foreground(lcAsagi)
	t.Tab = bg(r.NewStyle()).Foreground(lcText2)
	t.TabActive = bg(r.NewStyle()).Foreground(lcVermilion).Bold(true)

	t.Body = bg(r.NewStyle()).Foreground(lcWashi)
	t.Secondary = bg(r.NewStyle()).Foreground(lcText2)
	t.Dim = bg(r.NewStyle()).Foreground(lcAsagi)
	t.Heading = bg(r.NewStyle()).Foreground(lcWashi).Bold(true)

	t.Pane = bg(r.NewStyle()).
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lcAsagiDeep).
		BorderBackground(lcInk).
		Padding(1, 3)

	t.ColHeader = bg(r.NewStyle()).Foreground(lcAsagi)
	t.RowName = bg(r.NewStyle()).Foreground(lcWashi)
	t.RowNameSel = bg(r.NewStyle()).Foreground(lcWashi).Bold(true)
	t.RowFocus = bg(r.NewStyle()).Foreground(lcText2)
	t.RowFocusSel = bg(r.NewStyle()).Foreground(lcWashi)
	t.SelBar = bg(r.NewStyle()).Foreground(lcVermilion)
	t.StActive = bg(r.NewStyle()).Foreground(lcAsagiLight)
	t.StExper = bg(r.NewStyle()).Foreground(lcText2)
	t.StResearch = bg(r.NewStyle()).Foreground(lcAsagi)
	t.DetailText = bg(r.NewStyle()).Foreground(lcText2).Italic(true)

	t.SnipBlock = r.NewStyle().Background(lcSurface).Padding(1, 2)
	t.SnipPrompt = r.NewStyle().Background(lcSurface).Foreground(lcAsagiLight)
	t.SnipCmd = r.NewStyle().Background(lcSurface).Foreground(lcWashi)
	t.SnipOut = r.NewStyle().Background(lcSurface).Foreground(lcAsagi)

	t.BigDigit = bg(r.NewStyle()).Foreground(lcWashi)
	t.BigAccent = bg(r.NewStyle()).Foreground(lcAsagiLight)
	t.StatLabel = bg(r.NewStyle()).Foreground(lcAsagi)

	t.Link = bg(r.NewStyle()).Foreground(lcAsagiLight)

	t.Footer = bg(r.NewStyle()).Foreground(lcAsagi)
	t.FooterKey = bg(r.NewStyle()).Foreground(lcText2)

	t.TooSmall = bg(r.NewStyle()).Foreground(lcText2)
	return t
}

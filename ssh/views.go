package main

// views.go — all view composition. No color literals here; everything comes
// from the Theme and the shared palette via wave/banner helpers.

import (
	"fmt"
	"math"
	"strings"

	"github.com/charmbracelet/lipgloss"
)

const wordmark = "OPCEANAI"
const subtitle = "Intelligent systems, built like instruments."

// ---- intro ------------------------------------------------------------------

func (m *Model) viewIntro() string {
	if m.canvas == nil || m.canvas.W != m.w || m.canvas.H != m.h*2 {
		m.canvas = NewCanvas(m.w, m.h, m.th.Truecolor)
	}
	c := m.canvas
	c.ClearOverlay()
	lay := introLayout
	row := int(float64(m.h) * 0.13)
	if m.h < 30 { // short terminals: push the sea down, keep type clear of it
		lay.Horizon, lay.MidBase, lay.NearBase = 0.68, 0.80, 0.97
		lay.CrestAmp = 0.30
		row = 1
	}
	m.scene.Draw(c, lay)

	bw := bannerWidth(wordmark)
	if bw <= m.w-2 {
		reveal := clamp01((m.introT - 1.35) / 1.5)
		if reveal > 0 {
			drawBannerCells(c, wordmark, (m.w-bw)/2, row, reveal)
		}
	}

	// subtitle fade
	subA := clamp01((m.introT - 2.8) / 0.7)
	if subA > 0 {
		fg := lerpRGB(pInk, pText2, subA)
		c.SetText((m.w-len(subtitle))/2, row+glyphRows+1, subtitle, fg)
	}

	// press-any-key hint, quiet pulse
	if m.introT > 3.6 {
		hint := "press any key"
		a := 0.5 + 0.3*math.Sin(2.2*m.scene.T)
		fg := lerpRGB(pInk, pAsagi, a)
		c.SetText((m.w-len(hint))/2, row+glyphRows+3, hint, fg)
	}

	return c.Render()
}

// ---- too small ----------------------------------------------------------------

func (m *Model) viewTooSmall() string {
	msg := m.th.Body.Render("please enlarge your terminal") + "\n" +
		m.th.Dim.Render(fmt.Sprintf("%d×%d now · 60×20 minimum", m.w, m.h))
	return lipgloss.Place(m.w, m.h, lipgloss.Center, lipgloss.Center, msg,
		lipgloss.WithWhitespaceBackground(lcInk))
}

// ---- main layout ----------------------------------------------------------------

func (m *Model) viewMain() string {
	waveRows := m.waveBandRows()
	contentRows := m.h - waveRows - 2 // header line + footer line

	cw := 72
	if m.w < 80 {
		cw = m.w - 2
	}

	header := m.viewHeader(cw)
	body := m.viewSection(cw)
	footer := m.viewFooter()

	headerLine := lipgloss.Place(m.w, 1, lipgloss.Center, lipgloss.Top, header,
		lipgloss.WithWhitespaceBackground(lcInk))
	bodyBlock := lipgloss.Place(m.w, contentRows, lipgloss.Center, lipgloss.Center, body,
		lipgloss.WithWhitespaceBackground(lcInk))

	if m.canvas == nil || m.canvas.W != m.w || m.canvas.H != waveRows*2 {
		m.canvas = NewCanvas(m.w, waveRows, m.th.Truecolor)
	}
	m.canvas.ClearOverlay()
	m.scene.Draw(m.canvas, bandLayout)
	band := m.canvas.Render()

	footerLine := lipgloss.Place(m.w, 1, lipgloss.Center, lipgloss.Top, footer,
		lipgloss.WithWhitespaceBackground(lcInk))

	return headerLine + "\n" + bodyBlock + "\n" + band + "\n" + footerLine
}

func (m *Model) viewHeader(cw int) string {
	left := m.th.Wordmark.Render("OpceanAI") + m.th.WordmarkDim.Render(" · ssh")
	var tabs []string
	for i := section(0); i < sectionCount; i++ {
		num := m.th.Dim.Render(fmt.Sprintf("%d ", i+1))
		name := m.th.Tab.Render(sectionNames[i])
		if i == m.section {
			name = m.th.TabActive.Render(sectionNames[i])
		}
		tabs = append(tabs, num+name)
	}
	right := strings.Join(tabs, m.th.Dim.Render("  "))
	gap := cw - lipgloss.Width(left) - lipgloss.Width(right)
	if gap < 1 {
		gap = 1
	}
	return left + m.th.BG.Render(strings.Repeat(" ", gap)) + right
}

func (m *Model) viewSection(cw int) string {
	iw := cw - 8 // border (2) + padding (3+3)
	var inner string
	switch m.section {
	case secModels:
		inner = m.viewModels(iw)
	case secDoki:
		inner = m.viewDoki(iw)
	case secResearch:
		inner = m.viewResearch(iw)
	case secAbout:
		inner = m.viewAbout(iw)
	}
	return m.th.Pane.Width(cw - 2).Render(inner)
}

// ---- models ledger ----------------------------------------------------------------

func (m *Model) viewModels(iw int) string {
	nameW := 12
	statusW := 12
	focusW := iw - 2 - nameW - statusW - 2
	if focusW < 10 {
		focusW = 10
	}

	var b strings.Builder
	b.WriteString(m.th.ColHeader.Render(
		"  " + pad("NAME", nameW) + pad("FOCUS", focusW) + padLeft("STATUS", statusW+2)))
	b.WriteString("\n\n")

	for i, r := range modelRows {
		sel := i == m.sel
		bar := "  "
		nameStyle, focusStyle := m.th.RowName, m.th.RowFocus
		if sel {
			bar = m.th.SelBar.Render("▌ ")
			nameStyle, focusStyle = m.th.RowNameSel, m.th.RowFocusSel
		}
		var st lipgloss.Style
		switch r.status {
		case "Active":
			st = m.th.StActive
		case "Experimental":
			st = m.th.StExper
		default:
			st = m.th.StResearch
		}
		line := bar + nameStyle.Render(pad(r.name, nameW)) +
			focusStyle.Render(pad(r.focus, focusW)) +
			st.Render(padLeft(r.status, statusW+2))
		b.WriteString(line)
		b.WriteString("\n")
		if sel && m.showDetail {
			b.WriteString(m.th.DetailText.Render("  ▸ "+r.detail) + "\n")
		}
	}
	return strings.TrimRight(b.String(), "\n")
}

// ---- doki ----------------------------------------------------------------

func (m *Model) viewDoki(iw int) string {
	var b strings.Builder
	b.WriteString(m.th.Heading.Render("Doki"))
	b.WriteString(m.th.Dim.Render(" · "))
	b.WriteString(m.th.Secondary.Render("container runtime for Android"))
	b.WriteString("\n\n")
	b.WriteString(wrapStyled(
		"Doki brings the container workflow to Android devices: pull, run and "+
			"isolate model services on-device. OCI-compatible images, lightweight "+
			"isolation, ARM-first. Built to ship OpceanAI models to the edge.",
		iw, m.th.Secondary))
	b.WriteString("\n\n")

	snip := m.th.SnipPrompt.Render("$ ") + m.th.SnipCmd.Render("doki pull opceanai/yuuki-rxg:latest") + "\n" +
		m.th.SnipOut.Render("  ▸ layers 7/7 · 412 MB · verified") + "\n" +
		m.th.SnipPrompt.Render("$ ") + m.th.SnipCmd.Render("doki run --gpu adreno yuuki-rxg") + "\n" +
		m.th.SnipOut.Render("  ▸ container up · 0.9 s cold start")
	b.WriteString(m.th.SnipBlock.Width(iw).Render(snip))
	return b.String()
}

// ---- research ----------------------------------------------------------------

func (m *Model) viewResearch(iw int) string {
	var b strings.Builder
	stat := "-57.6%"
	if bannerWidth(stat) <= iw {
		big := styledBanner(stat, m.th)
		b.WriteString(lipgloss.PlaceHorizontal(iw, lipgloss.Center, big,
			lipgloss.WithWhitespaceBackground(lcInk)))
		b.WriteString("\n\n")
		label := m.th.StatLabel.Render("T O K E N S   ·   T S U K I   C O M P R E S S I O N")
		b.WriteString(lipgloss.PlaceHorizontal(iw, lipgloss.Center, label,
			lipgloss.WithWhitespaceBackground(lcInk)))
	} else {
		b.WriteString(m.th.Heading.Render("−57.6% tokens"))
	}
	b.WriteString("\n\n")
	b.WriteString(wrapStyled(
		"Tsuki compresses prompts before they ever reach the model. Across 4,160 "+
			"paired training examples, end-to-end token usage fell 57.6 percent with "+
			"no measurable loss in task accuracy — smaller context, same instrument.",
		iw, m.th.Secondary))
	return b.String()
}

// ---- about ----------------------------------------------------------------

func (m *Model) viewAbout(iw int) string {
	var b strings.Builder
	b.WriteString(m.th.Heading.Render("About"))
	b.WriteString("\n\n")
	b.WriteString(wrapStyled(
		"OpceanAI builds intelligent systems like instruments — precise, quiet "+
			"and dependable. Language models, applied mathematics, token "+
			"compression and on-device runtimes, tuned as one stack.",
		iw, m.th.Secondary))
	b.WriteString("\n\n")
	b.WriteString(m.th.Dim.Render("code     ") + m.th.Link.Render("github.com/OpceanAI") + "\n")
	b.WriteString(m.th.Dim.Render("models   ") + m.th.Link.Render("huggingface.co/OpceanAI") + "\n")
	b.WriteString(m.th.Dim.Render("web      ") + m.th.Link.Render("opceanai.com"))
	return b.String()
}

// ---- footer ----------------------------------------------------------------

func (m *Model) viewFooter() string {
	sep := m.th.Footer.Render(" · ")
	key := func(k, label string) string {
		return m.th.FooterKey.Render(k) + m.th.Footer.Render(" "+label)
	}
	parts := []string{key("←/→", "sections")}
	if m.section == secModels {
		parts = append(parts, key("↑/↓", "rows"))
		if m.showDetail {
			parts = append(parts, key("esc", "close"))
		} else {
			parts = append(parts, key("enter", "details"))
		}
	}
	parts = append(parts, key("q", "quit"))
	return strings.Join(parts, sep)
}

// ---- text helpers ----------------------------------------------------------------

func pad(s string, w int) string {
	if len(s) >= w {
		return s[:w]
	}
	return s + strings.Repeat(" ", w-len(s))
}

func padLeft(s string, w int) string {
	if len(s) >= w {
		return s
	}
	return strings.Repeat(" ", w-len(s)) + s
}

// wrapStyled word-wraps plain text to width and styles each line.
func wrapStyled(text string, w int, style lipgloss.Style) string {
	words := strings.Fields(text)
	var lines []string
	cur := ""
	for _, wd := range words {
		if cur == "" {
			cur = wd
		} else if len(cur)+1+len(wd) <= w {
			cur += " " + wd
		} else {
			lines = append(lines, cur)
			cur = wd
		}
	}
	if cur != "" {
		lines = append(lines, cur)
	}
	for i, l := range lines {
		lines[i] = style.Render(l)
	}
	return strings.Join(lines, "\n")
}

package main

// model.go — the Bubble Tea model: intro (the chart inks itself, the needle
// settles), then the sectioned TUI with the chart still alive beneath it.

import (
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/harmonica"
	"github.com/charmbracelet/lipgloss"
)

type appState int

const (
	stateIntro appState = iota
	stateMain
)

const (
	introFPS   = 30
	ambientFPS = 15
	minWidth   = 60
	minHeight  = 20

	introRevealSecs = 3.6
)

type section int

const (
	secModels section = iota
	secDoki
	secResearch
	secAbout
	sectionCount
)

var sectionNames = [sectionCount]string{"Models", "Doki", "Research", "About"}

type modelRow struct {
	name   string
	focus  string
	status string
	detail string
}

var modelRows = []modelRow{
	{"YuuKi RxG", "Flagship language model", "Active", "General reasoning core of the OpceanAI stack."},
	{"Yumo", "Applied mathematics", "Active", "Symbolic and numeric problem solving."},
	{"Tsuki", "Token compression", "Active", "4,160 examples · −57.6% tokens end-to-end."},
	{"Yaki", "Multimodal", "Experimental", "LLaVA vision adapter, on-device friendly."},
	{"OwO", "Omni-reasoning", "Research", "Long-horizon reasoning research line."},
	{"OvO", "Origin & versioning", "Research", "Model lineage, provenance and versioning."},
	{"Imprint", "Multimodal research", "Research", "Cross-modal representation studies."},
}

type tickMsg time.Time

// Model is the whole TUI.
type Model struct {
	th     *Theme
	w, h   int
	canvas *Canvas
	scene  ChartScene

	state    appState
	introT   float64
	lastTick time.Time

	spring  harmonica.Spring
	calmVel float64

	section    section
	sel        int
	showDetail bool

	quitting bool
}

// NewModel builds the model for one session.
func NewModel(r *lipgloss.Renderer, truecolor bool, w, h int) *Model {
	m := &Model{
		th:     NewTheme(r, truecolor),
		w:      w,
		h:      h,
		state:  stateIntro,
		spring: harmonica.NewSpring(harmonica.FPS(introFPS), 2.2, 0.82),
	}
	m.scene.seed = int(time.Now().UnixNano() & 0xffff)
	m.scene.monsterClock = 52 // first serpent ~20s in
	m.resize(w, h)
	return m
}

func (m *Model) resize(w, h int) {
	m.w, m.h = w, h
	if w < 1 || h < 1 {
		return
	}
	if m.state == stateIntro {
		m.canvas = NewCanvas(w, h, m.th.Truecolor)
	} else {
		m.canvas = NewCanvas(w, m.chartBandRows(), m.th.Truecolor)
	}
}

// chartBandRows: how many terminal rows the ambient chart keeps under the
// menu. Short terminals give rows back to the content pane first.
func (m *Model) chartBandRows() int {
	upper := m.h / 4
	if upper < 6 {
		upper = 6
	}
	if upper > 13 {
		upper = 13
	}
	r := m.h - 17 // leave room for the tallest pane + header + footer
	if r < 3 {
		r = 3
	}
	if r > upper {
		r = upper
	}
	return r
}

func (m *Model) tickCmd() tea.Cmd {
	fps := introFPS
	if m.state == stateMain {
		fps = ambientFPS
	}
	return tea.Tick(time.Second/time.Duration(fps), func(t time.Time) tea.Msg {
		return tickMsg(t)
	})
}

func (m *Model) Init() tea.Cmd {
	m.lastTick = time.Now()
	return m.tickCmd()
}

func (m *Model) enterMain() {
	m.state = stateMain
	m.scene.Reveal = 1
	m.resize(m.w, m.h)
}

// syncShip aims the caravel at the selected harbor.
func (m *Model) syncShip() {
	sel := m.sel
	if sel > len(ports)-1 {
		sel = len(ports) - 1
	}
	m.scene.SelPort = sel
	m.scene.ShipTarget = float64(sel) / float64(len(ports)-1)
}

func (m *Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	case tea.WindowSizeMsg:
		m.resize(msg.Width, msg.Height)
		return m, nil

	case tickMsg:
		now := time.Time(msg)
		dt := now.Sub(m.lastTick).Seconds()
		if dt > 0.1 {
			dt = 0.1
		}
		m.lastTick = now
		m.scene.Update(dt)
		if m.state == stateIntro {
			m.introT += dt
			m.scene.Reveal = clamp01(m.introT / introRevealSecs)
		}
		// calm target: 0 during intro, 1 once the menu is up
		calmTarget := 0.0
		if m.state == stateMain {
			calmTarget = 1.0
		}
		m.scene.Calm, m.calmVel = m.spring.Update(m.scene.Calm, m.calmVel, calmTarget)
		return m, m.tickCmd()

	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			m.quitting = true
			return m, tea.Quit
		case "esc":
			if m.state == stateMain && m.showDetail {
				m.showDetail = false
				return m, nil
			}
			m.quitting = true
			return m, tea.Quit
		}
		if m.state == stateIntro {
			m.enterMain()
			return m, nil
		}
		return m.updateMain(msg)
	}
	return m, nil
}

func (m *Model) updateMain(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.String() {
	case "left", "h", "shift+tab":
		m.section = (m.section + sectionCount - 1) % sectionCount
		m.showDetail = false
	case "right", "l", "tab":
		m.section = (m.section + 1) % sectionCount
		m.showDetail = false
	case "1":
		m.section = secModels
	case "2":
		m.section = secDoki
	case "3":
		m.section = secResearch
	case "4":
		m.section = secAbout
	case "up", "k":
		if m.section == secModels && m.sel > 0 {
			m.sel--
			m.showDetail = false
			m.syncShip()
		}
	case "down", "j":
		if m.section == secModels && m.sel < len(modelRows)-1 {
			m.sel++
			m.showDetail = false
			m.syncShip()
		}
	case "enter":
		if m.section == secModels {
			m.showDetail = !m.showDetail
		}
	}
	return m, nil
}

func (m *Model) View() string {
	if m.quitting {
		return ""
	}
	if m.w < minWidth || m.h < minHeight {
		return m.viewTooSmall()
	}
	if m.state == stateIntro {
		return m.viewIntro()
	}
	return m.viewMain()
}

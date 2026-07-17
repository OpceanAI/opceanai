package main

// main.go — OpceanAI over telnet.
//
//	go run . -local   # run the TUI directly in this terminal
//	go run .          # serve on :2323 (OPCEAN_TELNET_PORT to change)
//
// Anonymous by design: no auth, no shell, no command interpretation — the
// only thing a session can do is watch the chart. Port 23 is the most
// scanned port on the internet; the defenses are per-IP and global
// connection caps plus idle/absolute deadlines, with rate limiting left to
// nftables where it belongs.

import (
	"errors"
	"flag"
	"fmt"
	"net"
	"os"
	"os/signal"
	"strings"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
	"github.com/muesli/termenv"
)

const (
	idleTimeout = 15 * time.Minute
	maxSession  = 2 * time.Hour
	maxPerIP    = 10
	maxGlobal   = 400
)

func main() {
	local := flag.Bool("local", false, "run the TUI in the local terminal (no telnet)")
	dump := flag.Float64("dump", -1, "render one intro frame at t seconds to stdout and exit (debug)")
	dumpSec := flag.Int("dumpsec", -1, "render the main view at section N to stdout and exit (debug)")
	dumpSel := flag.Int("dumpsel", 0, "selected row for -dumpsec (debug)")
	dumpDetail := flag.Bool("dumpdetail", false, "open the detail line for -dumpsec (debug)")
	dumpW := flag.Int("dumpw", 120, "terminal width for debug dumps")
	dumpH := flag.Int("dumph", 40, "terminal height for debug dumps")
	flag.Parse()

	if *dumpSec >= 0 {
		runDumpMain(*dumpSec, *dumpSel, *dumpDetail, *dumpW, *dumpH)
		return
	}
	if *dump >= 0 {
		runDumpIntro(*dump, *dumpW, *dumpH)
		return
	}
	if *local {
		runLocal()
		return
	}
	runServer()
}

// runDumpIntro simulates the intro to time t and prints one raw frame — the
// visual-verification pipeline converts it to PNG.
func runDumpIntro(t float64, w, h int) {
	r := lipgloss.DefaultRenderer()
	r.SetColorProfile(termenv.TrueColor)
	m := NewModel(r, true, w, h)
	dt := 1.0 / float64(introFPS)
	for e := 0.0; e < t; e += dt {
		m.scene.Update(dt)
		m.introT += dt
		m.scene.Reveal = clamp01(m.introT / introRevealSecs)
	}
	fmt.Println(m.viewIntro())
}

// runDumpMain simulates intro + settle, then prints the main view.
func runDumpMain(sec, sel int, detail bool, w, h int) {
	r := lipgloss.DefaultRenderer()
	r.SetColorProfile(termenv.TrueColor)
	m := NewModel(r, true, w, h)
	dt := 1.0 / float64(introFPS)
	for e := 0.0; e < 4.5; e += dt {
		m.scene.Update(dt)
		m.introT += dt
		m.scene.Reveal = clamp01(m.introT / introRevealSecs)
	}
	m.enterMain()
	m.sel = sel
	m.syncShip()
	for e := 0.0; e < 3.0; e += dt {
		m.scene.Update(dt)
		m.scene.Calm, m.calmVel = m.spring.Update(m.scene.Calm, m.calmVel, 1.0)
	}
	m.section = section(sec)
	m.showDetail = detail
	fmt.Println(m.View())
}

func runLocal() {
	r := lipgloss.DefaultRenderer()
	truecolor := r.ColorProfile() == termenv.TrueColor
	m := NewModel(r, truecolor, 0, 0)
	p := tea.NewProgram(m, tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}

// ---- server ------------------------------------------------------------------

var (
	ipMu    sync.Mutex
	ipConns = map[string]int{}
	global  atomic.Int64
)

func acquire(ip string) bool {
	if global.Add(1) > maxGlobal {
		global.Add(-1)
		return false
	}
	ipMu.Lock()
	defer ipMu.Unlock()
	if ipConns[ip] >= maxPerIP {
		global.Add(-1)
		return false
	}
	ipConns[ip]++
	return true
}

func release(ip string) {
	global.Add(-1)
	ipMu.Lock()
	defer ipMu.Unlock()
	ipConns[ip]--
	if ipConns[ip] <= 0 {
		delete(ipConns, ip)
	}
}

func runServer() {
	port := os.Getenv("OPCEAN_TELNET_PORT")
	if port == "" {
		port = "2323"
	}
	host := os.Getenv("OPCEAN_TELNET_HOST")
	if host == "" {
		host = "" // dual-stack wildcard
	}
	addr := net.JoinHostPort(host, port)

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		log.Error("could not listen", "addr", addr, "error", err)
		os.Exit(1)
	}
	log.Info("starting OpceanAI telnet server", "addr", addr)

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				if errors.Is(err, net.ErrClosed) {
					return
				}
				log.Error("accept error", "error", err)
				continue
			}
			go handle(conn)
		}
	}()

	<-done
	log.Info("stopping server")
	ln.Close()
}

func handle(conn net.Conn) {
	defer conn.Close()
	ip, _, _ := net.SplitHostPort(conn.RemoteAddr().String())
	if !acquire(ip) {
		conn.Write([]byte("the harbor is full — try again later\r\n"))
		return
	}
	defer release(ip)

	start := time.Now()
	ic := newIdleConn(conn, idleTimeout, maxSession)
	lw := &lockedWriter{w: ic}
	ts := negotiate(ic, lw)

	// give negotiation a moment: first NAWS and the TTYPE answer usually
	// arrive within milliseconds; nc-style clients send nothing at all.
	w, h := 80, 24
	ttype := ""
	telnetClient := false
	deadline := time.After(1 * time.Second)
gather:
	for {
		select {
		case sz, ok := <-ts.Sizes:
			if !ok {
				return // connection died during negotiation
			}
			w, h = sz.Width, sz.Height
		case tt := <-ts.TType:
			ttype = tt
		case <-ts.IAC:
			telnetClient = true
		case <-deadline:
			break gather
		}
		if telnetClient && ttype != "" && (w != 80 || h != 24) {
			break gather
		}
	}

	// modern default is truecolor (mirrors the SSH sibling); degrade to
	// ANSI256 only when the terminal type is visibly old.
	truecolor := true
	lt := strings.ToLower(ttype)
	for _, old := range []string{"vt1", "vt2", "vt3", "dumb", "linux"} {
		if strings.Contains(lt, old) {
			truecolor = false
			break
		}
	}
	if lt == "ansi" {
		truecolor = false
	}

	r := lipgloss.NewRenderer(lw)
	if truecolor {
		r.SetColorProfile(termenv.TrueColor)
	} else {
		r.SetColorProfile(termenv.ANSI256)
	}

	m := NewModel(r, truecolor, w, h)
	opts := []tea.ProgramOption{tea.WithInput(ts.Input), tea.WithOutput(lw)}
	if telnetClient {
		opts = append(opts, tea.WithAltScreen())
	}
	p := tea.NewProgram(m, opts...)

	// NAWS resizes flow in for the session's lifetime; the channel closing
	// means the read side died, so the program is told to quit rather than
	// animating for a ghost.
	go func() {
		for sz := range ts.Sizes {
			p.Send(tea.WindowSizeMsg{Width: sz.Width, Height: sz.Height})
		}
		p.Quit()
	}()

	log.Info("session start", "ip", ip, "ttype", ttype, "size", fmt.Sprintf("%dx%d", w, h), "telnet", telnetClient)
	if _, err := p.Run(); err != nil {
		log.Error("session error", "ip", ip, "error", err)
	}
	p.Kill()
	log.Info("session end", "ip", ip, "duration", time.Since(start).Round(time.Second))
}

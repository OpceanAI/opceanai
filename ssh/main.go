package main

// main.go — OpceanAI over SSH.
//
//	go run . -local   # run the TUI directly in this terminal
//	go run .          # serve on :2323 (OPCEAN_SSH_PORT to change)
//
// Anonymous by design: every public key and keyboard-interactive attempt is
// accepted. No shell is ever exposed — the only thing a session can do is
// watch the wave.

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
	"github.com/charmbracelet/ssh"
	"github.com/charmbracelet/wish"
	"github.com/charmbracelet/wish/activeterm"
	bm "github.com/charmbracelet/wish/bubbletea"
	"github.com/charmbracelet/wish/logging"
	"github.com/charmbracelet/wish/ratelimiter"
	"github.com/muesli/termenv"
	gossh "golang.org/x/crypto/ssh"
	"golang.org/x/time/rate"
)

func main() {
	local := flag.Bool("local", false, "run the TUI in the local terminal (no SSH)")
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
		m.scene.Rise, m.riseVel = m.spring.Update(m.scene.Rise, m.riseVel, 1.0)
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
		m.scene.Rise, m.riseVel = m.spring.Update(m.scene.Rise, m.riseVel, 1.0)
	}
	m.enterMain()
	for e := 0.0; e < 2.0; e += dt {
		m.scene.Update(dt)
		m.scene.Calm, m.calmVel = m.spring.Update(m.scene.Calm, m.calmVel, 1.0)
	}
	m.section = section(sec)
	m.sel = sel
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

func teaHandler(s ssh.Session) (tea.Model, []tea.ProgramOption) {
	pty, _, _ := s.Pty()
	renderer := bm.MakeRenderer(s)
	truecolor := renderer.ColorProfile() == termenv.TrueColor
	m := NewModel(renderer, truecolor, pty.Window.Width, pty.Window.Height)
	return m, []tea.ProgramOption{tea.WithAltScreen()}
}

func runServer() {
	port := os.Getenv("OPCEAN_SSH_PORT")
	if port == "" {
		port = "2323"
	}
	host := os.Getenv("OPCEAN_SSH_HOST")
	if host == "" {
		host = "0.0.0.0"
	}
	hostKey := os.Getenv("OPCEAN_HOST_KEY")
	if hostKey == "" {
		hostKey = ".ssh/host_key"
	}

	s, err := wish.NewServer(
		wish.WithAddress(net.JoinHostPort(host, port)),
		wish.WithHostKeyPath(hostKey),
		// anonymous by design: accept everyone, expose nothing but the TUI
		wish.WithPublicKeyAuth(func(ssh.Context, ssh.PublicKey) bool { return true }),
		wish.WithKeyboardInteractiveAuth(func(ssh.Context, gossh.KeyboardInteractiveChallenge) bool { return true }),
		wish.WithMiddleware(
			// wish executes middleware bottom-up: limiter → logger → tty gate → tui
			bm.MiddlewareWithColorProfile(teaHandler, termenv.TrueColor),
			activeterm.Middleware(),
			logging.Middleware(),
			ratelimiter.Middleware(ratelimiter.NewRateLimiter(rate.Limit(4), 8, 512)),
		),
	)
	if err != nil {
		log.Error("could not create server", "error", err)
		os.Exit(1)
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	log.Info("starting OpceanAI SSH server", "host", host, "port", port)
	go func() {
		if err := s.ListenAndServe(); err != nil && !errors.Is(err, ssh.ErrServerClosed) {
			log.Error("server error", "error", err)
			done <- syscall.SIGTERM
		}
	}()

	<-done
	log.Info("stopping server")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := s.Shutdown(ctx); err != nil && !errors.Is(err, ssh.ErrServerClosed) {
		log.Error("shutdown error", "error", err)
	}
}

package main

// proxy.go — the telnet layer, derived from RFC 854/857/858/1073/1091.
//
// Output needs no translation: ANSI truecolor, alt-screen and cursor
// sequences are plain bytes to telnet. Only the input stream is filtered —
// IAC negotiation is stripped and answered here, clean keystrokes flow to
// Bubble Tea through a pipe. The opening WILL ECHO + WILL SGA burst is the
// classic "kludge mode" that flips every telnet client into
// character-at-a-time input with no local echo.

import (
	"bufio"
	"io"
	"sync"
)

const (
	tSE   = 240
	tSB   = 250
	tWILL = 251
	tWONT = 252
	tDO   = 253
	tDONT = 254
	tIAC  = 255

	optEcho  = 1
	optSGA   = 3
	optTTYPE = 24
	optNAWS  = 31

	ttypeIS   = 0
	ttypeSEND = 1
)

// WindowSize is one NAWS report — the telnet analogue of SIGWINCH.
type WindowSize struct{ Width, Height int }

// lockedWriter serializes conn writes between the negotiator goroutine and
// the Bubble Tea renderer so an IAC reply can never split an SGR sequence.
type lockedWriter struct {
	mu sync.Mutex
	w  io.Writer
}

func (l *lockedWriter) Write(p []byte) (int, error) {
	l.mu.Lock()
	defer l.mu.Unlock()
	return l.w.Write(p)
}

// TelnetSession is the clean side of the proxy.
type TelnetSession struct {
	Input io.ReadCloser      // keystrokes, IAC-free
	Sizes <-chan WindowSize  // closed when the connection dies
	TType <-chan string      // first TERMINAL-TYPE IS answer
	IAC   <-chan struct{}    // signaled once on the first IAC seen
}

// negotiate sends the opening option burst and starts the filter goroutine.
func negotiate(conn io.Reader, out io.Writer) *TelnetSession {
	out.Write([]byte{
		tIAC, tWILL, optEcho,
		tIAC, tWILL, optSGA,
		tIAC, tDO, optSGA,
		tIAC, tDO, optTTYPE,
		tIAC, tDO, optNAWS,
	})

	pr, pw := io.Pipe()
	sizes := make(chan WindowSize, 8)
	ttypes := make(chan string, 1)
	iacSeen := make(chan struct{}, 1)

	go func() {
		defer close(sizes)
		br := bufio.NewReaderSize(conn, 512)
		sentTTYPEReq := false
		markIAC := func() {
			select {
			case iacSeen <- struct{}{}:
			default:
			}
		}
		for {
			b, err := br.ReadByte()
			if err != nil {
				pw.CloseWithError(err)
				return
			}
			if b != tIAC {
				if _, err := pw.Write([]byte{b}); err != nil {
					return
				}
				continue
			}
			c, err := br.ReadByte()
			if err != nil {
				pw.CloseWithError(err)
				return
			}
			switch c {
			case tIAC: // escaped literal 0xFF
				pw.Write([]byte{tIAC})

			case tWILL, tWONT, tDO, tDONT:
				o, err := br.ReadByte()
				if err != nil {
					pw.CloseWithError(err)
					return
				}
				markIAC()
				switch c {
				case tWILL:
					switch o {
					case optTTYPE:
						if !sentTTYPEReq {
							sentTTYPEReq = true
							out.Write([]byte{tIAC, tSB, optTTYPE, ttypeSEND, tIAC, tSE})
						}
					case optNAWS, optSGA:
						// agreed in our opening burst; re-acking would loop
					default:
						out.Write([]byte{tIAC, tDONT, o})
					}
				case tDO:
					switch o {
					case optEcho, optSGA:
						// we announced these
					default:
						out.Write([]byte{tIAC, tWONT, o})
					}
				}
				// WONT / DONT need no answer

			case tSB:
				opt, err := br.ReadByte()
				if err != nil {
					pw.CloseWithError(err)
					return
				}
				// read subnegotiation data to IAC SE, unescaping IAC IAC;
				// a bare SE byte inside data is NOT a terminator. Capped —
				// input is hostile bytes on a public port.
				data := make([]byte, 0, 64)
			sub:
				for {
					d, err := br.ReadByte()
					if err != nil {
						pw.CloseWithError(err)
						return
					}
					if d == tIAC {
						e, err := br.ReadByte()
						if err != nil {
							pw.CloseWithError(err)
							return
						}
						switch e {
						case tSE:
							break sub
						case tIAC:
							d = tIAC
						default:
							continue
						}
					}
					if len(data) < 64 {
						data = append(data, d)
					}
				}
				markIAC()
				switch opt {
				case optNAWS:
					if len(data) == 4 {
						w := int(data[0])<<8 | int(data[1])
						h := int(data[2])<<8 | int(data[3])
						if w > 0 && h > 0 {
							select {
							case sizes <- WindowSize{w, h}:
							default:
							}
						}
					}
				case optTTYPE:
					if len(data) >= 2 && data[0] == ttypeIS {
						select {
						case ttypes <- string(data[1:]):
						default:
						}
					}
				}
			}
		}
	}()

	return &TelnetSession{Input: pr, Sizes: sizes, TType: ttypes, IAC: iacSeen}
}

package main

import (
	"bytes"
	"io"
	"sync"
	"testing"
	"time"
)

type safeBuf struct {
	mu sync.Mutex
	b  bytes.Buffer
}

func (s *safeBuf) Write(p []byte) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.b.Write(p)
}

func (s *safeBuf) Bytes() []byte {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]byte(nil), s.b.Bytes()...)
}

func TestOpeningBurst(t *testing.T) {
	var out safeBuf
	negotiate(bytes.NewReader(nil), &out)
	want := []byte{
		tIAC, tWILL, optEcho,
		tIAC, tWILL, optSGA,
		tIAC, tDO, optSGA,
		tIAC, tDO, optTTYPE,
		tIAC, tDO, optNAWS,
	}
	if got := out.Bytes(); !bytes.Equal(got[:len(want)], want) {
		t.Fatalf("opening burst = %v, want %v", got[:len(want)], want)
	}
}

func TestNAWSAndTTYPEAndKeystrokes(t *testing.T) {
	input := []byte{
		tIAC, tWILL, optNAWS,
		tIAC, tSB, optNAWS, 0, 120, 0, 40, tIAC, tSE,
		tIAC, tWILL, optTTYPE,
		tIAC, tSB, optTTYPE, ttypeIS, 'x', 't', 'e', 'r', 'm', tIAC, tSE,
		'q',
	}
	var out safeBuf
	ts := negotiate(bytes.NewReader(input), &out)

	keys, err := io.ReadAll(ts.Input)
	if err != nil && err != io.EOF {
		t.Fatalf("input read error: %v", err)
	}
	if string(keys) != "q" {
		t.Fatalf("keystrokes = %q, want %q", keys, "q")
	}

	select {
	case sz := <-ts.Sizes:
		if sz.Width != 120 || sz.Height != 40 {
			t.Fatalf("size = %dx%d, want 120x40", sz.Width, sz.Height)
		}
	case <-time.After(time.Second):
		t.Fatal("no NAWS size received")
	}

	select {
	case tt := <-ts.TType:
		if tt != "xterm" {
			t.Fatalf("ttype = %q, want %q", tt, "xterm")
		}
	case <-time.After(time.Second):
		t.Fatal("no terminal type received")
	}

	// the WILL TTYPE must have triggered exactly one SEND request
	req := []byte{tIAC, tSB, optTTYPE, ttypeSEND, tIAC, tSE}
	if !bytes.Contains(out.Bytes(), req) {
		t.Fatal("TTYPE SEND request not written")
	}
}

func TestIACEscapes(t *testing.T) {
	// a literal 0xFF in the data stream, and a NAWS report for a
	// 255-column terminal whose width byte must be IAC-escaped
	input := []byte{
		tIAC, tIAC, 'a',
		tIAC, tSB, optNAWS, 0, tIAC, tIAC, 0, 50, tIAC, tSE,
	}
	var out safeBuf
	ts := negotiate(bytes.NewReader(input), &out)

	keys, _ := io.ReadAll(ts.Input)
	if !bytes.Equal(keys, []byte{0xFF, 'a'}) {
		t.Fatalf("keystrokes = %v, want [255 97]", keys)
	}
	select {
	case sz := <-ts.Sizes:
		if sz.Width != 255 || sz.Height != 50 {
			t.Fatalf("size = %dx%d, want 255x50", sz.Width, sz.Height)
		}
	case <-time.After(time.Second):
		t.Fatal("no NAWS size received")
	}
}

func TestZeroNAWSIgnored(t *testing.T) {
	input := []byte{tIAC, tSB, optNAWS, 0, 0, 0, 0, tIAC, tSE}
	var out safeBuf
	ts := negotiate(bytes.NewReader(input), &out)
	io.ReadAll(ts.Input)
	if _, ok := <-ts.Sizes; ok {
		t.Fatal("0x0 NAWS report should be dropped")
	}
}

func TestUnhandledOptionsRefused(t *testing.T) {
	const optLinemode = 34
	input := []byte{
		tIAC, tWILL, optLinemode,
		tIAC, tDO, optTTYPE,
	}
	var out safeBuf
	ts := negotiate(bytes.NewReader(input), &out)
	io.ReadAll(ts.Input)

	got := out.Bytes()
	if !bytes.Contains(got, []byte{tIAC, tDONT, optLinemode}) {
		t.Fatal("WILL LINEMODE not answered with DONT")
	}
	if !bytes.Contains(got, []byte{tIAC, tWONT, optTTYPE}) {
		t.Fatal("unexpected DO not answered with WONT")
	}
}

func TestIACSignal(t *testing.T) {
	input := []byte{tIAC, tWILL, optNAWS, 'x'}
	var out safeBuf
	ts := negotiate(bytes.NewReader(input), &out)
	io.ReadAll(ts.Input)
	select {
	case <-ts.IAC:
	case <-time.After(time.Second):
		t.Fatal("IAC presence not signaled")
	}
}

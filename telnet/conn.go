package main

// conn.go — a net.Conn wrapper enforcing idle and absolute deadlines.
// A stalled or abandoned client hits the deadline and gets disconnected
// instead of holding a session open; the write deadline also bounds how
// long a slow reader can stall the renderer.

import (
	"net"
	"time"
)

type idleConn struct {
	net.Conn
	idle time.Duration
	max  time.Time
}

func newIdleConn(c net.Conn, idle, max time.Duration) *idleConn {
	ic := &idleConn{Conn: c, idle: idle, max: time.Now().Add(max)}
	ic.bump()
	return ic
}

func (c *idleConn) bump() {
	d := time.Now().Add(c.idle)
	if d.After(c.max) {
		d = c.max
	}
	c.Conn.SetDeadline(d)
}

func (c *idleConn) Read(p []byte) (int, error) {
	n, err := c.Conn.Read(p)
	c.bump()
	return n, err
}

func (c *idleConn) Write(p []byte) (int, error) {
	n, err := c.Conn.Write(p)
	c.bump()
	return n, err
}

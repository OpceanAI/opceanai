# OpceanAI over Telnet

A telnet-served terminal experience: a living portolan chart — candlelit
vellum, the 32-wind rhumb network in the historical three-color convention,
a compass rose in the Reinel tradition whose needle settles on north, a
caravel tracing a dotted minium route between harbor toponyms, and a sea
serpent that surfaces, rarely, in the HIC SVNT LEONES quadrant. Built with
[Bubble Tea](https://github.com/charmbracelet/bubbletea),
[Lip Gloss](https://github.com/charmbracelet/lipgloss) and
[Harmonica](https://github.com/charmbracelet/harmonica) over a hand-rolled
telnet layer. Sibling of the SSH wave server.

```
telnet opceanai.com          # once port 23 points here
```

## Run locally (no telnet)

```sh
go run . -local
```

Best in a truecolor terminal ≥ 100×30. Keys: `←/→` or `1–4` sections,
`↑/↓` rows (the ship sails to the selected harbor), `enter` details,
`q` quit.

## Serve

```sh
go run .                     # listens on :2323
OPCEAN_TELNET_PORT=2222 go run .
```

Test it:

```sh
telnet localhost 2323
```

Environment:

| var                  | default   | meaning        |
| -------------------- | --------- | -------------- |
| `OPCEAN_TELNET_PORT` | `2323`    | listen port    |
| `OPCEAN_TELNET_HOST` | dual-stack wildcard | listen address |

## The telnet layer

Derived from RFC 854/857/858/1073/1091 — no telnet library. Output needs no
translation (ANSI truecolor, alt-screen and cursor sequences are plain bytes
to telnet); only the input stream is filtered. On accept the server sends
`WILL ECHO · WILL SGA · DO SGA · DO TTYPE · DO NAWS`, which flips every
telnet client into character-at-a-time input with no local echo:

- **NAWS** (option 31) reports become live `WindowSizeMsg` resizes.
- **TERMINAL-TYPE** (option 24) picks the color profile: truecolor by
  default, ANSI-256 for visibly old terminal types (`vt1xx`, `dumb`,
  `linux`, `ansi`).
- Clients that never speak IAC (`nc`) get the animation as a plain stream —
  no alt-screen, no mouse, nothing to corrupt their terminal.
- A literal `0xFF` inside subnegotiation data is `IAC IAC`-escaped (a
  255-column terminal produces one); subnegotiation length is capped
  because everything arriving on a public telnet port is hostile bytes.

## Production notes

### Point port 23 at it

Run the server as an unprivileged user on `:2323` and redirect 23 → 2323
with nftables (v4 **and** v6 — port 23 is the most scanned port on the
internet, the caps and deadlines below are the real defense):

```sh
nft add table ip nat
nft 'add chain ip nat prerouting { type nat hook prerouting priority dnat; }'
nft add rule ip nat prerouting tcp dport 23 redirect to :2323
nft add table ip6 nat
nft 'add chain ip6 nat prerouting { type nat hook prerouting priority dnat; }'
nft add rule ip6 nat prerouting tcp dport 23 redirect to :2323
```

### Built-in limits

- 10 concurrent connections per IP, 400 global.
- 15 min idle timeout, 2 h absolute session cap — enforced as socket
  deadlines, so a stalled client is disconnected instead of buffering.
- No auth, no shell, no command interpretation: the only session handler
  is the render loop.

### systemd unit

```ini
# /etc/systemd/system/opceanai-telnet.service
[Unit]
Description=OpceanAI telnet chart
After=network.target

[Service]
DynamicUser=yes
WorkingDirectory=/opt/opceanai-telnet
ExecStart=/opt/opceanai-telnet/opceanai-telnet
Environment=OPCEAN_TELNET_PORT=2323
Restart=on-failure
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
MemoryMax=1G

[Install]
WantedBy=multi-user.target
```

Build the binary with `go build -o opceanai-telnet .`.

## Development

```sh
go run . -dump 5.0 > frame.txt           # raw intro frame at t=5s
go run . -dumpsec 2 -dumpw 80 -dumph 24  # main view, section 3, 80×24
python3 ../ssh/tools/ansi2png.py frame.txt frame.png  # render to PNG
go test ./...                            # telnet negotiation tests
```

## Architecture

| file           | role                                                        |
| -------------- | ----------------------------------------------------------- |
| `main.go`      | TCP server, caps, `-local` mode, debug dumps                |
| `proxy.go`     | telnet IAC negotiation: NAWS, TTYPE, keystroke filter       |
| `conn.go`      | idle + absolute deadline conn wrapper                       |
| `canvas.go`    | half-block pixel canvas + ink stroke helpers                |
| `chart.go`     | parchment, rhumb network, coast, labels, layout             |
| `rose.go`      | compass rose + damped needle                                |
| `ship.go`      | caravel, dotted route, sea serpent                          |
| `cartouche.go` | strapwork title frame + vellum wash                         |
| `banner.go`    | hand-drawn 7-row block font (wordmark + big stat)           |
| `styles.go`    | the single theme: every color in the app lives here         |
| `model.go`     | Bubble Tea model, tick loop, keys, resize                   |
| `views.go`     | intro composition + section views + footer                  |

## Historical notes

The details are period-correct on purpose: the three-color rhumb convention
(principal winds in gall ink, half-winds in verdigris, quarter-winds in
minium), the fleur-de-lis standing in for Tramontana (Pedro Reinel,
c. 1504), the cross toward the Levant, toponyms perpendicular to the coast
with important harbors in red, V for U in the capitals, the tronco de
leguas scale bar — and HIC SVNT LEONES, the phrase real charts actually
used.

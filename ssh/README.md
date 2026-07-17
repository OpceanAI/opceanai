# OpceanAI over SSH

An SSH-served terminal experience: an animated aizuri-e Great Wave rendered in
half-block pseudo-pixels, followed by a small ledger of OpceanAI models,
research and links. Built with [wish](https://github.com/charmbracelet/wish),
[Bubble Tea](https://github.com/charmbracelet/bubbletea),
[Lip Gloss](https://github.com/charmbracelet/lipgloss) and
[Harmonica](https://github.com/charmbracelet/harmonica).

```
ssh ssh.opceanai.com        # once port 22 points here
```

## Run locally (no SSH)

```sh
go run . -local
```

Best in a truecolor terminal ≥ 100×30. Keys: `←/→` or `1–4` sections,
`↑/↓` rows, `enter` details, `q` quit.

## Serve

```sh
go run .                    # listens on :2323
OPCEAN_SSH_PORT=2222 go run .
```

Test it:

```sh
ssh -p 2323 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null localhost
```

Environment:

| var               | default          | meaning                       |
| ----------------- | ---------------- | ----------------------------- |
| `OPCEAN_SSH_PORT` | `2323`           | listen port                   |
| `OPCEAN_SSH_HOST` | `0.0.0.0`        | listen address                |
| `OPCEAN_HOST_KEY` | `.ssh/host_key`  | host key path (auto-created)  |

The host key is generated on first start and persisted; keep it stable so
clients don't see key-change warnings. It is gitignored.

## Production notes

### Point port 22 at it

Run the server as an unprivileged user on `:2323` and redirect 22 → 2323 with
nftables (keep real sshd on another port, or bind this to a dedicated IP):

```sh
nft add table ip nat
nft 'add chain ip nat prerouting { type nat hook prerouting priority dnat; }'
nft add rule ip nat prerouting tcp dport 22 redirect to :2323
```

### systemd unit

```ini
# /etc/systemd/system/opceanai-ssh.service
[Unit]
Description=OpceanAI SSH TUI
After=network.target

[Service]
User=opcean
WorkingDirectory=/opt/opceanai-ssh
ExecStart=/opt/opceanai-ssh/opceanai-ssh
Environment=OPCEAN_SSH_PORT=2323
Restart=on-failure
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/opt/opceanai-ssh/.ssh
ProtectHome=true

[Install]
WantedBy=multi-user.target
```

Build the binary with `go build -o opceanai-ssh .`.

### Security

- **No shell is exposed.** The only session handler is the Bubble Tea app;
  there is no exec, no subsystem, no port forwarding handler.
- **Anonymous by design.** Public-key and keyboard-interactive auth both
  accept everyone — authentication is intentionally a no-op, like
  `ssh terminal.shop`. Nothing sensitive is reachable.
- Per-IP rate limiting via wish's `ratelimiter` middleware
  (4 conn/s, burst 8, 512 tracked addresses).
- Sessions render truecolor by default (forced minimum profile — SSH clients
  rarely forward `COLORTERM`, and every modern terminal supports 24-bit
  color). ANSI-256 fallback paths exist throughout the canvas and theme.

## Development

```sh
go run . -dump 4.5 > frame.txt          # raw intro frame at t=4.5s
go run . -dumpsec 2 -dumpw 80 -dumph 24 # main view, section 3, 80×24
python3 tools/ansi2png.py frame.txt frame.png  # render a capture to PNG
```

`tools/ansi2png.py` converts `tmux capture-pane -e` output (or `-dump` output)
into a PNG for visual inspection.

## Architecture

| file        | role                                                        |
| ----------- | ----------------------------------------------------------- |
| `main.go`   | wish server, middleware, `-local` mode, debug dumps         |
| `wave.go`   | half-block pixel canvas + procedural Great Wave + particles |
| `banner.go` | hand-drawn 7-row block font (wordmark + big stat)           |
| `styles.go` | the single theme: every color in the app lives here         |
| `model.go`  | Bubble Tea model, tick loop, keys, resize                   |
| `views.go`  | intro composition + section views + footer                  |

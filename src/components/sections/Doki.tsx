import TerminalSession, { type SessionLine } from "@/components/doki/TerminalSession";
import AsciiWave from "@/components/doki/AsciiWave";

/**
 * Doki — the product shown as a real, populated artifact: a console that
 * replays a plausible session (typed live on first view), clipped at its
 * bottom edge (content padded well clear of the cut) and floated with a
 * layered indigo shadow. Below it, the SSH TUI's procedural ASCII wave —
 * the same DNA rendered in half-block glyphs on a canvas.
 */
const session: SessionLine[] = [
  { kind: "cmd", text: "doki pull alpine:3.20" },
  { kind: "out", text: "pulling manifest sha256:beefdbd8 … done" },
  { kind: "out", text: "extracting 3 layers … done" },
  { kind: "cmd", text: "doki run -d --name sync-agent alpine:3.20" },
  { kind: "out", text: "9f3c1ab2" },
  { kind: "cmd", text: "doki ps" },
  { kind: "dim", text: "CONTAINER  IMAGE         STATUS   ISOLATION" },
  { kind: "out", text: "9f3c1ab2   alpine:3.20   Up 12s   L2 · proot" },
  { kind: "out", text: "41d7e09c   nginx:1.27    Up 3h    L3 · ns" },
  { kind: "out", text: "c208aa41   redis:7.4     Up 26m   L2 · proot" },
  { kind: "cmd", text: "doki stats sync-agent" },
  { kind: "out", text: "CPU 2.1%   MEM 18.4 MiB   NET 0.6 KiB/s" },
];

export default function Doki() {
  return (
    <section id="system" className="relative w-full px-6 py-36 sm:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
        {/* The artifact leads. */}
        <div className="relative lg:order-2">
          <div className="relative h-[380px] overflow-hidden rounded-[10px]">
            <div className="terminal absolute inset-x-0 top-0 h-[430px] overflow-hidden px-4 pb-24 pt-4 text-[11px] sm:px-6 sm:text-[13px]">
              <p className="pb-3 text-xs tracking-[0.12em] text-[var(--terminal-dim)]">
                doki · termux — arm64
              </p>
              <TerminalSession lines={session} />
            </div>
          </div>

          {/* The wave strip — ssh.opceanai.com's half-block sea, ported. */}
          <div className="terminal-wave mt-4 overflow-hidden rounded-[8px]">
            <AsciiWave className="block w-full" />
          </div>
        </div>

        <div className="lg:order-1">
          <h2 className="font-display text-4xl font-medium tracking-tight text-text-primary sm:text-5xl">
            Doki
          </h2>
          <p className="mt-5 text-xl font-medium leading-snug text-text-primary">
            OCI containers, natively on Android.
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
            Standard Docker images run unmodified on-device — no cloud, no
            remote daemon. Four isolation layers, from sandboxed to
            system-level, selected per environment.
          </p>
          <div className="mt-9">
            <a
              href="https://doki.opceanai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link"
            >
              Read the documentation
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

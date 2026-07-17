/** ASL — a quiet, single-row roadmap note between Doki and Research. */
export default function ASL() {
  return (
    <section className="relative w-full px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="ledger-rule" />
        <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:gap-10">
          <span className="shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-text-quaternary">
            In development
          </span>
          <p className="text-base leading-relaxed text-text-secondary">
            <span className="font-medium text-text-primary">
              ASL — Android Subsystem for Linux.
            </span>{" "}
            A complete Linux kernel in userspace, built in C++ and Rust.
            Kernel-first — work begins after Doki v1.
          </p>
        </div>
        <div className="ledger-rule" />
      </div>
    </section>
  );
}

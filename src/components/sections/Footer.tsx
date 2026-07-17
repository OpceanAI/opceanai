import FooterWordmark from "@/components/sections/FooterWordmark";

/**
 * Footer — a real link grid aligned to the page margins, then the wordmark
 * set giant, whole and centered, anchored flush to the bottom edge and
 * bleeding slightly off it.
 */
const columns = [
  {
    heading: "Projects",
    items: [
      { label: "YuuKi v0.1", href: "https://yuuki-web.vercel.app/" },
      { label: "YuuKi RxG", href: "https://yuuki.opceanai.com/" },
      { label: "Doki", href: "https://doki.opceanai.com" },
    ],
  },
  {
    heading: "Research",
    items: [
      { label: "NHE", href: "https://huggingface.co/Not-Humanity-Exam" },
      { label: "Tsuki", href: "https://huggingface.co/tsuki-team" },
      { label: "YuuKi RxG weights", href: "https://huggingface.co/OpceanAI/Yuuki-RxG" },
    ],
  },
  {
    heading: "Organization",
    items: [
      { label: "GitHub", href: "https://github.com/OpceanAI" },
      { label: "Hugging Face", href: "https://huggingface.co/OpceanAI" },
      { label: "YuuKi OS", href: "https://github.com/YuuKi-OS" },
    ],
  },
];

const contacts = [
  { label: "Business", email: "contact@opceanai.com" },
  { label: "General", email: "opceanai@gmail.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden pt-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-display text-[13px] tracking-[0.01em] text-text-tertiary">
                {col.heading}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-[13px] tracking-[0.01em] text-text-tertiary">
              Contact
            </h4>
            <ul className="mt-5 space-y-3">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {c.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 text-xs text-text-quaternary">
          OpceanAI · 2023–{year}
        </p>
      </div>

      {/* The wordmark owns the bottom edge — it settles as you arrive. */}
      <FooterWordmark />
    </footer>
  );
}

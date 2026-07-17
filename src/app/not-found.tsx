import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-canvas text-text-primary min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8">
          <div>
            <p className="font-mono text-text-quaternary text-sm tracking-widest uppercase mb-4">
              Error 404
            </p>
            <h1 className="font-display text-6xl sm:text-8xl font-medium text-text-primary tracking-tight">
              Not Found
            </h1>
          </div>

          <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist.
          </p>

          <div className="flex items-center justify-center pt-2">
            <Link href="/" className="arrow-link">
              Return to OpceanAI
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="text-text-quaternary text-xs font-mono">
            Try searching for: yuuki, doki, nhe, tsuki
          </p>
        </div>
      </body>
    </html>
  );
}

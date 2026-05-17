import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-canvas text-text-primary min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8">
          <div>
            <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">
              Error 404
            </p>
            <h1 className="font-display text-6xl sm:text-8xl font-light text-text-primary tracking-tight">
              Not Found
            </h1>
          </div>

          <div className="divider max-w-xs mx-auto" />

          <p className="text-text-tertiary text-lg max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist.
            Or maybe it never did.
          </p>

          <p className="text-text-quaternary text-sm max-w-sm mx-auto italic">
            &ldquo;Quality over noise, even without recognition.&rdquo;
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="btn-primary"
            >
              Return to OpceanAI
            </Link>
          </div>

          <div className="divider max-w-xs mx-auto" />

          <p className="text-text-quaternary text-xs font-mono">
            Try searching for: yuuki, doki, nhe, tsuki, origin
          </p>
        </div>
      </body>
    </html>
  );
}

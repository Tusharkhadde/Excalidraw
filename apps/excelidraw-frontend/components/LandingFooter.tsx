import Link from "next/link";
import { PenTool } from "lucide-react";

const footerSections = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Live Demo", href: "#demo" },
    { label: "Self-host", href: "#open-source" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Community", href: "#" },
  ],
  Company: [
    { label: "GitHub", href: "https://github.com/excalidraw/excalidraw" },
    { label: "Contributors", href: "#" },
    { label: "License (MIT)", href: "#" },
    { label: "Security", href: "#" },
  ],
};

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 text-slate-600 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-[1fr_2fr]">
          {/* Brand Details */}
          <div className="flex flex-col gap-6 text-left">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                <PenTool className="h-4.5 w-4.5 text-white transform -rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Excelidraw
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              A real-time collaborative whiteboard.
              <br />
              Open-source. Self-hostable. Yours.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/excalidraw/excalidraw"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
              >
                <GitHubIcon />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
              >
                <XIcon />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
              >
                <DiscordIcon />
              </a>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerSections).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-4 text-left">
                <span className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
                  {category}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200/60 py-8 text-sm text-slate-500 md:flex-row">
          <span>
            &copy; {new Date().getFullYear()} Excelidraw. Open source under the
            MIT License.
          </span>
          
          {/* Custom Heart Badge pill */}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-4 pr-2 py-1.5 text-xs text-slate-700">
            <span>Made with <span className="text-red-500">❤️</span> by the community</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500 text-[10px] font-bold">
              ♥
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


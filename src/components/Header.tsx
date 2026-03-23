import type { FC } from "react";

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#1ed760] to-emerald-700 shadow-lg shadow-emerald-900/50">
            <svg
              className="h-5 w-5 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold tracking-tight text-white">
              Spotify Sharer
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              Paste a Spotify album URL into any slot to save it to MongoDB.
              Everyone who visits sees your recommendations. Code on{" "}
              <a
                href="https://github.com/JamieDawson/spotify-app-frontend-code"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-emerald-400 underline decoration-emerald-500/40 underline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { Spotify } from "react-spotify-embed";
import axios from "axios";
import Header from "./components/Header";
import { parseSpotifyAlbumUrl } from "./lib/spotifyAlbumUrl";

type Album = {
  one: string;
  two: string;
  three: string;
  four: string;
};

type AlbumKey = keyof Album;

const SLOTS: { key: AlbumKey; label: string; hint: string }[] = [
  { key: "one", label: "Slot 1", hint: "Paste an album link…" },
  { key: "two", label: "Slot 2", hint: "Paste an album link…" },
  { key: "three", label: "Slot 3", hint: "Paste an album link…" },
  { key: "four", label: "Slot 4", hint: "Paste an album link…" },
];

function App() {
  const [albumOne, setAlbumOne] = useState("");
  const [albumTwo, setAlbumTwo] = useState("");
  const [albumThree, setAlbumThree] = useState("");
  const [albumFour, setAlbumFour] = useState("");

  const [allAlbums, setAllAlbums] = useState<Album[]>([
    { one: "", two: "", three: "", four: "" },
  ]);

  const [validUrls, setValidUrls] = useState<{
    [key in AlbumKey]: boolean | null;
  }>({
    one: null,
    two: null,
    three: null,
    four: null,
  });

  const inputByKey: Record<
    AlbumKey,
    { value: string; setValue: (v: string) => void }
  > = {
    one: { value: albumOne, setValue: setAlbumOne },
    two: { value: albumTwo, setValue: setAlbumTwo },
    three: { value: albumThree, setValue: setAlbumThree },
    four: { value: albumFour, setValue: setAlbumFour },
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get<Album>(
          "https://spotify-app-backend-code.vercel.app/getAlbum"
        );
        setAllAlbums([
          {
            one: response.data.one,
            two: response.data.two,
            three: response.data.three,
            four: response.data.four,
          },
        ]);
      } catch {
        console.log("Failed to fetch album data");
      }
    };

    fetchAlbum();
  }, []);

  const updateAlbumOnBackend = async (updates: Partial<Album>) => {
    const response = await fetch(
      "https://spotify-app-backend-code.vercel.app/albumsUpdate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const updateAlbums = async (
    event: React.FormEvent,
    index: number,
    albumKey: AlbumKey,
    typedAlbumFromInput: string
  ) => {
    event.preventDefault();

    const parsed = parseSpotifyAlbumUrl(typedAlbumFromInput);

    if (!parsed.ok) {
      setValidUrls((prev) => ({ ...prev, [albumKey]: false }));
      return;
    }

    const urlToStore = parsed.canonicalUrl;
    const newObject = [...allAlbums];
    newObject[index] = {
      ...newObject[index],
      [albumKey]: urlToStore,
    };
    setAllAlbums(newObject);
    setValidUrls((prev) => ({ ...prev, [albumKey]: true }));

    const updates: Partial<Album> = { [albumKey]: urlToStore };

    try {
      await updateAlbumOnBackend(updates);
    } catch (error) {
      console.error("Error updating album on backend:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-emerald-600/25 blur-[100px]" />
        <div className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-teal-500/15 blur-[90px]" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-12">
          <div className="mb-10 text-center lg:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
              Your picks
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Four albums, one page
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
              Update any slot with a Spotify album URL. Valid links save to the
              backend so visitors see the same rotation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
            {SLOTS.map(({ key, label, hint }) => {
              const link = allAlbums[0][key];
              const { value, setValue } = inputByKey[key];
              const invalid = validUrls[key] === false;

              return (
                <article
                  key={key}
                  className="group flex flex-col rounded-2xl border border-white/8 bg-white/3 p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-md transition hover:border-emerald-500/25 hover:bg-white/5"
                >
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {label}
                    </span>
                    {link ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                        Empty
                      </span>
                    )}
                  </div>

                  <div className="mb-5 min-h-[232px] overflow-hidden rounded-xl border border-white/6 bg-black/40 shadow-inner">
                    {link ? (
                      <div className="[&_iframe]:min-h-[232px] [&_iframe]:w-full">
                        <Spotify link={link} />
                      </div>
                    ) : (
                      <div className="flex h-[232px] flex-col items-center justify-center gap-2 px-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-500">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.125 1.125 0 01-1.371-1.09V8.688m6.75 3.75v7.875m0 0a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H9"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-zinc-500">No album yet</p>
                        <p className="text-xs text-zinc-600">
                          Add a link below to embed
                        </p>
                      </div>
                    )}
                  </div>

                  <form
                    className="mt-auto space-y-3"
                    onSubmit={(e) => updateAlbums(e, 0, key, value)}
                  >
                    <label className="sr-only" htmlFor={`album-${key}`}>
                      {label} Spotify URL
                    </label>
                    <input
                      id={`album-${key}`}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none ring-emerald-500/0 transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/30"
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      placeholder={hint}
                      onChange={(e) => setValue(e.target.value)}
                      value={value}
                    />
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-linear-to-b from-[#1ed760] to-spotify-dim px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-950/40 transition hover:brightness-110 active:scale-[0.98]"
                    >
                      Save {label.toLowerCase()}
                    </button>
                  </form>

                  {invalid && (
                    <p
                      className="mt-3 text-center text-xs font-medium text-red-400"
                      role="alert"
                    >
                      That doesn&apos;t look like a valid Spotify album URL.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

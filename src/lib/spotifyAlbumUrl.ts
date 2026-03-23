/**
 * Parse a Spotify album link or URI without calling the Web API.
 * Spotify has restricted browser + client-credentials access; validating
 * shape here is enough for saving — the embed still won't play invalid IDs.
 */
export type ParsedSpotifyAlbum =
  | { ok: true; albumId: string; canonicalUrl: string }
  | { ok: false };

function isLikelySpotifyId(id: string): boolean {
  return /^[a-zA-Z0-9]{10,32}$/.test(id);
}

export function parseSpotifyAlbumUrl(input: string): ParsedSpotifyAlbum {
  const raw = input.trim();
  if (!raw) return { ok: false };

  const noQuery = raw.split("?")[0].trim();

  const uriMatch = /^spotify:album:([a-zA-Z0-9]+)$/i.exec(noQuery);
  if (uriMatch) {
    const id = uriMatch[1];
    if (!isLikelySpotifyId(id)) return { ok: false };
    return {
      ok: true,
      albumId: id,
      canonicalUrl: `https://open.spotify.com/album/${id}`,
    };
  }

  let parsed: URL;
  try {
    const href = /^https?:\/\//i.test(noQuery)
      ? noQuery
      : `https://${noQuery}`;
    parsed = new URL(href);
  } catch {
    return { ok: false };
  }

  if (!parsed.hostname.toLowerCase().endsWith("open.spotify.com")) {
    return { ok: false };
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  const albumIdx = segments.indexOf("album");
  if (albumIdx === -1 || albumIdx === segments.length - 1) {
    return { ok: false };
  }

  const id = segments[albumIdx + 1];
  if (!isLikelySpotifyId(id)) return { ok: false };

  return {
    ok: true,
    albumId: id,
    canonicalUrl: `https://open.spotify.com/album/${id}`,
  };
}

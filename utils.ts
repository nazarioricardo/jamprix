import type { Track } from "./types";
import { Track as SpotifyTrack } from "spotify-types";

type ParseTrack = (track: SpotifyTrack) => Track;
export const parseTrack: ParseTrack = (track) => {
  return {
    id: track.id,
    artist: track.artists[0].name,
    album: track.album.name,
    name: track.name,
    href: track.external_urls.spotify,
    uri: track.uri,
    preview_url: track.preview_url,
    image: track.album.images[0].url,
  };
};

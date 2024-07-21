export const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndGZmam1jaGl1bnBrZXF1ZnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3MzM4MDMsImV4cCI6MjAzMTMwOTgwM30.DzhE3t2F9Cxhfk1FMgbvZiTm9HG8a-O11Bp9C7AZ7vA";
export const SUPABASE_URL = "https://igtffjmchiunpkequfqc.supabase.co";
export const SUPABASE_CALLBACK_URL =
  "https://igtffjmchiunpkequfqc.supabase.co/auth/v1/callback";
// const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

export const APPLE_PLAYLISTS_URL =
  "https://api.music.apple.com/v1/me/library/playlists";

export type Profile = {
  user_id: string;
  email: string;
  apple_id: string;
  spotify_id: string;
  created_at: string;
};

export type Channel = {
  id: string;
  title: string;
  description: string;
  created_by: Profile;
  created_at: string;
};

export type Participant = {
  profile: Profile;
  channel: Channel;
};

export type Theme = {
  title: string;
  description: string;
};

export type Event = {
  id: string;
  theme: Theme;
  channel: Channel;
};

export type Submission = {
  profile: string;
  event: number;
  apple_id: string | null;
  spotify_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Track = {
  id: string;
  artist: string;
  album: string;
  name: string;
  href: string;
  uri: string;
  preview_url: string;
  image: string;
};

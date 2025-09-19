export type Profile = {
  user_id: string;
  display_name: string;
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

export type Theme = {
  title: string;
  description: string;
};

export type Event = {
  id: string;
  theme: Theme;
  submissions?: Submission[];
};

export type Submission = {
  id: string;
  user_id: string;
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

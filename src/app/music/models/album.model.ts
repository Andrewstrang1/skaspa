export interface Album {
  title: string; // Album title
  artist: string; // Main artist or band
  cat: string; // Catalog number
  albumArt: AlbumArt[]; // Array of artwork with type (e.g., Front Cover, Back Cover)
  tracks: Track[]; // Array of tracks
  duration: number; // Total album duration in seconds
  releaseID: string; // Discogs release ID
  mediaAvailable: boolean; // Flag indicating media availability
  saved: boolean; // Flag indicating if data is saved
  label?: string; // Record label (e.g., EMI, Atlantic)
  image?: string
  year?: string
  country?: string
  genre?: string

}

export interface AlbumArt {
  url: string; // Image URL
  type: string; // E.g., 'Front Cover', 'Back Cover'
}

export interface Track {
  title: string;
  duration: string;
  trackNumber: string;
  discNumber: number;
  performer: string[];
  composer: string[];
  producer: string[];
  oldFileName?: string;
  newFileName?: string;
}

export interface PlayList {
  title: string;
  url: string;
  thumbnail?: string;
}

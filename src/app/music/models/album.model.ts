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
  label: string; // Record label (e.g., EMI, Atlantic)
  image: string
  year?: string
  country?: string
  genre?: string

}

export interface AlbumArt {
  url: string; // Image URL
  type: string; // E.g., 'Front Cover', 'Back Cover'
}
export interface Track {
  title: string; // Track title
  duration: number; // Track duration in seconds
  trackNumber: number; // Track order
  discNumber: number; // Disc or volume number for multi-disc albums
  vinylTrackPosition?: string; // e.g., A1, B2
  composer: string[]; // Array of composers
  performer: string[]; // Array of performers
  producer: string[]; // Array of producers
}

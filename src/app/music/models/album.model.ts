export interface Album {
  title: string; // Album title
  artist: string; // Main artist or band
  cat: string; // Catalog number
  albumArt: AlbumArt[]; // Array of artwork with type (e.g., Front Cover, Back Cover)
  tracks: Track[]; // Array of tracks
  duration: number; // Total album duration in seconds
  releaseID: string; // Discogs release ID
  masterID?: string // Discogs master ID
  mediaAvailable: boolean; // Flag indicating media availability
  saved: boolean; // Flag indicating if data is saved
  label?: string; // Record label (e.g., EMI, Atlantic)
  image?: string
  year?: string
  country?: string
  genre?: string
  link?: string
  format?: string
  coverArtPageLink?: string,
  trackCount?: number

}

export interface AlbumArt {
  url: string; // Image URL
  type: string; // E.g., 'Front Cover', 'Back Cover'
}

export interface Track {
  artist: any;
  album: any;
  title: string;
  length: string;
  credits: string;
  trackNumber: string;
  discNumber: number;  
  oldFileName?: string;
  newFileName?: string;
  trackImage?: string;
  recordingid?: string; 
}

export interface PlayList {
  artist?: string;
  albumTitle?: string;
  title: string;
  url: string;
  thumbnail?: string;
  id: string;
}

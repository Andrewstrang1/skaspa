export interface Album {
  title: string;
  artist: string;
  catalogNumber: string;
  artworkUrl: string;
  tracks: Track[];
  duration: number; // Total duration in seconds
  mediaAvailable: boolean;
  saved: boolean;

}

export interface Track {
  title: string;
  duration: number; // Change this to a number (in seconds)
  trackNumber: string;
  artist: string;
}

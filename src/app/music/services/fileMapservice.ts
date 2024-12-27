import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { Album, Track } from '../models/album.model';

@Injectable({
  providedIn: 'root',
})
export class FileMapService {
  mapFileToTrack(album: Album, files: string[]): any {
    // Configure Fuse.js options
    const fuseOptions = {
      includeScore: true,
      threshold: 0.3, // Lower values mean stricter matching
      keys: [], // Use the item itself as the key
    };

    // Initialize Fuse.js with the files
    const fuse = new Fuse(files, fuseOptions);

    album.tracks.forEach((track) => {
      // Perform fuzzy search using the track title
      const result = fuse.search(track.title);

      if (result.length > 0 && result[0].score !== undefined && result[0].score <= 0.3) {
        // If a close match is found, assign it
        const bestMatch = result[0].item; // Get the best matching file
        track.oldFileName = bestMatch;
        track.newFileName = track.title + '.mp3';

      } else {
        // If no good match is found, set it to "NO MATCH"
        track.oldFileName = 'NO MATCH'; // Manually edit
        track.newFileName = 'NO MATCH.mp3'; // Manually edit
        console.warn(`No good match found for track: ${track.title}`);
      }
    });

    return album.tracks;
  }
}

import { Injectable } from '@angular/core';
import { YouTubeService } from '../services/youTube.service';
import { Album, Track } from '../models/album.model';

@Injectable({
  providedIn: 'root',
})
export class TrackFileService {
  trackToFileMapping: { [trackNumber: string]: any } = {};

  constructor(private youtubeService: YouTubeService) {}

  assignFileToTrack(album: Album | null, file: any): void {
    if (!album) return;
    const trackNumber = prompt('Enter the track number to assign this file to:');
    if (trackNumber && album.tracks.some((track) => track.trackNumber === trackNumber)) {
      this.trackToFileMapping[trackNumber] = file;
    } else {
      alert('Invalid track number.');
    }
  }

  updateTrackToFileMapping(album: Album | null, files: any[]): void {
    if (!album) return;
    this.trackToFileMapping = {};
    album.tracks.forEach((track) => {
      const matchingFile = files.find((file) =>
        file.title.toLowerCase().includes(track.title.toLowerCase())
      );
      if (matchingFile) {
        this.trackToFileMapping[track.trackNumber] = matchingFile;
      }
    });
  }

  saveTrackMappings(album: Album | null): void {
    if (!album) return;
    const payload = Object.keys(this.trackToFileMapping).map((trackNumber) => {
      const file = this.trackToFileMapping[trackNumber];
      const track = album.tracks.find((t) => t.trackNumber === trackNumber);
      if (!track) {
        console.warn(`Track not found for trackNumber: ${trackNumber}`);
        return null; // Skip this mapping if the track is undefined
      }
      return {
        oldFilename: file.filePath,
        newFileName: `${track.title}.mp3`,
        metaData: {
          title: track.title,
          artist: album.artist,
          album: album.title,
          trackNumber: track.trackNumber,
          duration: track.duration,
        },
      };
    });

    this.youtubeService.renameAndUpdateTracks(payload).subscribe({
      next: () => {
        console.log('Track mappings saved successfully.');
      },
      error: (err) => {
        console.error('Error saving track mappings:', err);
      },
    });
  
  }
}

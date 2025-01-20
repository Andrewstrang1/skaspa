import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { Album, Track } from '../models/album.model';

@Injectable({
  providedIn: 'root',
})
export class FileMapService {

  /**
   * Maps files to album tracks.
   * Called from: DetailsComponent.downloadPlaylist.next
   */
  mapFileToTrack(album: Album, files: string[]): Track[] {
    const fuseOptions = {
      includeScore: true,
      threshold: 0.6, // Lower values mean stricter matching
      keys: [''],
    };

    const fuse = new Fuse(files, fuseOptions);

    album.tracks.forEach((track) => {
      console.log('track.title:', track.title);

      const result = fuse.search(track.title);
      console.log('result:', result);

      if (result.length > 0 && result[0].score !== undefined && result[0].score <= fuseOptions.threshold) {
        const bestMatch = result[0].item;
        track.oldFileName = bestMatch;
        track.newFileName = track.title + '.mp3';
      } else {
        track.oldFileName = 'NO MATCH';
        track.newFileName = 'NO MATCH.mp3';
        console.warn(`No match found for track: ${track.title}`);
      }
    });

    return album.tracks;
  }

  /**
   * Prepare payload for Node.js API.
   * @param tracks The list of tracks and metadata.
   * @param imageElement The HTML image element for album art.
   * @returns {object} The payload to send to the Node.js API.
   */
  async preparePayload(album: Album, imageElement: HTMLImageElement): Promise<object> {
    const tracks = album.tracks.map((track) => ({
      oldFileName: track.oldFileName,
      newFileName: track.newFileName,
      // performers: track.performers,
      // producers: track.producers,
      // composers: track.composers,
      metaData: {
        title: track.title,
        artist: track.artist,
        album: track.album,
        trackNumber: track.trackNumber,
        length: track.length,
      },
    }));
  
    // Extract album art as Base64
    const albumArtBase64 = await this.getImageBase64(imageElement);
    console.log('albumArtBase64:', albumArtBase64);
  
    return {
      albumTitle: album.title,
      artist: album.artist,
      year: album.year,
      tracks,
      albumArt: albumArtBase64       
    };
  }

  /**
   * Convert an image element to a Base64 payload, handling different MIME types.
   * @param imageElement The HTML image element.
   * @returns {object} An object containing the Base64 string and MIME type.
   */
  private async getImageBase64(imageElement: HTMLImageElement): Promise<string> {
    const tempFile = new File([imageElement.src], 'temp.jpg', { type: 'image/jpg' });
    const reader = new FileReader();
    reader.readAsDataURL(tempFile);
    const result = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject('Error reading image file');
    });
    const base64String = result as string;
    if (!base64String) {
      throw new Error('Failed to read image file');
    }
    console.log('Base64 string:', base64String);
    return base64String;
  }
}

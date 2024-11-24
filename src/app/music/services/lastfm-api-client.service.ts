import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UriBuilderService } from './uri-builder.service';

@Injectable({
  providedIn: 'root',
})
export class LastFmApiClientService {
  private apiUrl: string;
  private apiKey: string;
  private sharedSecret: string;

  constructor(private http: HttpClient, private uriBuilderService: UriBuilderService) {
    // Load configuration from UriBuilderService
    const lastFmConfig = this.uriBuilderService.getConfiguration('LastFmConfig');
    this.apiUrl = lastFmConfig.ApiUrl;
    this.apiKey = lastFmConfig.ApiKey;
    this.sharedSecret = lastFmConfig.SharedSecret;
  }

  /**
   * Fetch albums by artist using the LastFm API.
   */
  getAlbumsByArtist(artistName: string, selectedTitle: string = ''): Observable<Album[]> {
    const requestUrl = this.uriBuilderService.getLastFmArtistSearchUrl(artistName);
    return this.http.get<any>(requestUrl).pipe(
      map((response) => {
        const albumsArray = response?.topalbums?.album || [];
        return albumsArray
          .map((albumObject: any) => this.parseAlbum(albumObject))
          .filter((album: Album) =>
            selectedTitle ? album.title.toLowerCase() === selectedTitle.toLowerCase() : true
          );
      }),
      catchError((error) => {
        console.error('Error fetching albums:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch track listings for a given album.
   */
  getTrackListings(album: Album): Observable<Album> {
    const requestUrl = this.uriBuilderService.getLastFmAlbumTracksUrl(album.artist, album.title);
    return this.http.get<any>(requestUrl).pipe(
      map((response) => {
        const tracks = this.parseTrackListings(response);
        return { ...album, tracks };
      }),
      catchError((error) => {
        console.error('Error fetching track listings:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Parse album details from the response.
   */
  private parseAlbum(albumObject: any): Album {
    const albumName = albumObject.name || 'Unknown Album';
    const artistName = albumObject.artist?.name || 'Unknown Artist';
    const images = albumObject.image || [];
    const imageUrl =
      images.find((img: any) => img.size === 'large')?.['#text'] || 'default-image-url';

    return {
      title: albumName,
      artist: artistName,
      year: 'N/A', // Year might need separate parsing
      imageUrl,
      tracks: [],
    };
  }

  /**
   * Parse track listings from the response.
   */
  private parseTrackListings(response: any): Track[] {
    const tracksArray = response?.album?.tracks?.track || [];
    return tracksArray.map((track: any, index: number) => ({
      trackNumber: (index + 1).toString(),
      name: track.name || 'Unknown Track',
      composer: track.composer || '',
      length: this.formatDuration(track.duration || '0'),
    }));
  }

  /**
   * Format duration from seconds to mm:ss format.
   */
  private formatDuration(duration: string): string {
    const seconds = parseInt(duration, 10);
    if (!isNaN(seconds)) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return '0:00';
  }
}

interface Album {
  title: string;
  artist: string;
  year: string;
  imageUrl: string;
  tracks: Track[];
}

interface Track {
  trackNumber: string;
  name: string;
  composer: string;
  length: string;
}

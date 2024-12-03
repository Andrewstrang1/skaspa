import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Discogs } from '../../services/api-config';
import { Album, Track } from '../models/album.model';

@Injectable({
  providedIn: 'root',
})
export class DiscogsService {
  private discogsConfig = Discogs[0];

  constructor(private http: HttpClient) { }

  // Search for albums by artist and title
  searchAlbum(artist: string, album: string): Observable<Album[]> {
    const url = `${this.discogsConfig.ApiUrl}/database/search`;
    const params = new HttpParams()
      .set('q', `${artist} ${album}`)
      .set('type', 'release')
      .set('key', this.discogsConfig.ConsumerKey)
      .set('secret', this.discogsConfig.ConsumerSecret);

    return this.http.get<any>(url, { params }).pipe(
      map((response) => this.mapDiscogsToAlbums(response.results))
    );
  }

  // Get album details by release ID
  getAlbumDetails(releaseId: string): Observable<Album> {
    const url = `${this.discogsConfig.ApiUrl}/releases/${releaseId}`;
    return this.http.get<any>(url).pipe(
      map((response) => this.mapDiscogsToAlbumDetails(response))
    );
  }

  // Map Discogs search results to Album model
  private mapDiscogsToAlbums(results: any[]): Album[] {
    return results.map((result) => {
      const [artist, ...titleParts] = result.title.split(' - '); // Split on ' - '
      return {
        title: titleParts.join(' - ') || result.title || 'Unknown Title', // Join remaining parts for the title
        artist: artist || 'Unknown Artist', // First part becomes the artist
        catalogNumber: result.catno || 'N/A', // Handle undefined catalog number
        artworkUrl: result.cover_image || 'assets/default-album-art.png', // Use default if no image
        image: result.cover_image || 'assets/default-album-art.png', // Use default if no image
        tracks: [], // Detailed tracks can be fetched later
        duration: 0, // Placeholder for now
        mediaAvailable: false,
        saved: false,
      };
    });
  }
  
  


  // Map Discogs album details to Album model
  private mapDiscogsToAlbumDetails(details: any): Album {
    return {
      title: details.title,
      artist: details.artists[0]?.name || '',
      catalogNumber: details.labels[0]?.catno || '',
      artworkUrl: details.images?.[0]?.uri || '',
      image: details.images?.[0]?.uri || '',
      tracks: details.tracklist.map((track: any): Track => ({
        title: track.title,
        duration: this.convertDuration(track.duration),
        trackNumber: track.position || '',
        artist: details.artists[0]?.name || '',
      })),
      duration: this.calculateTotalDuration(details.tracklist),
      mediaAvailable: false,
      saved: false,
    };
  }

  // Utility to convert duration from mm:ss to seconds
  private convertDuration(duration: string): number {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  // Utility to calculate total album duration
  private calculateTotalDuration(tracklist: any[]): number {
    return tracklist.reduce(
      (total, track) => total + this.convertDuration(track.duration || '0:00'),
      0
    );
  }
}

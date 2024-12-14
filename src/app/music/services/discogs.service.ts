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
  private localApiBaseUrl = 'http://localhost:3000/api'; // Base URL for local API

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

  // Get album details by release ID and images separately
  getAlbumDetails(releaseId: string): Observable<Album> {
    const detailsUrl = `${this.discogsConfig.ApiUrl}/releases/${releaseId}`;
    const imagesUrl = `http://localhost:3000/api/discogs/images/${releaseId}`;
  
    // Fetch album details and images in parallel
    return this.http.get<any>(detailsUrl).pipe(
      map((details) => this.mapDiscogsToAlbumDetails(details)),
      map((album) => {
        // Fetch images after details
        this.http.get<{ images: string[] }>(imagesUrl).subscribe((response) => {
          album.albumArt = response.images.map((url) => ({
            url,
            type: '' // Default type
          }));
        });
        return album;
      })
    );
  }

  // Fetch album images from local API
  getAlbumImages(releaseId: string): Observable<string[]> {
    const url = `${this.localApiBaseUrl}/discogs/images/${releaseId}`;
    return this.http.get<{ images: string[] }>(url).pipe(
      map((response) => response.images || [])
    );
  }

  // Map Discogs search results to Album model
  private mapDiscogsToAlbums(results: any[]): Album[] {
    console.log(results);
    return results.map((result) => {
      const [artist, ...titleParts] = result.title.split(' - '); // Split on ' - '
      const title = titleParts.join(' ') || 'Unknown Title'; // Join remaining parts for the title
      return {
        title: title, // Extracted album title
        artist: artist || 'Unknown Artist', // First part becomes the artist
        cat: result.catno || 'N/A', // Handle undefined catalog number
        albumArt: [{ url: result.cover_image || 'assets/default-album-art.png', type: 'Front Cover' }], // Front cover as default
        image: result.cover_image,
        tracks: [], // Detailed tracks can be fetched later
        duration: 0, // Placeholder for now
        releaseID: result.id, // Add releaseID from API response
        mediaAvailable: false, // Default to false
        saved: false, // Default to false
        recordLabel: result.label?.[0] || 'Unknown Label', // First label or default
        genre: result.style,
        year: result.year,
        country: result.country,
        label: result.label?.[0] || 'Unknown Label',
      };
    });
  }  
  
  // Map Discogs album details to Album model
  private mapDiscogsToAlbumDetails(details: any): Album {
    console.log('Raw response: ', details);
    return {
      image: '',
      title: details.title || 'Unknown Title',
      artist: details.artists?.[0]?.name || 'Unknown Artist',
      cat: details.labels?.[0]?.catno || 'N/A',
      albumArt: details.images?.map((image: any) => image.uri || image.resource_url || 'assets/default-album-art.png') || [],
      tracks: details.tracklist.map((track: any): Track => ({
        title: track.title || 'Unknown Title',
        // duration: this.convertDuration(track.duration || '0:00'),
        duration: (track.duration || '0:00'),
        // trackNumber: parseInt(track.position, 10) || 0,
        trackNumber: track.position || 0,
        discNumber: track.disc || 1,
        composer: track.composers || [],
        performer: track.performers || [],
        producer: track.producers || [],
      })),
      duration: this.calculateTotalDuration(details.tracklist),
      releaseID: details.id || '',
      mediaAvailable: false,
      saved: false,
      label: details.labels?.[0]?.name || 'Unknown Label',
      genre: details.style,
      year: details.year,
      country: details.country
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

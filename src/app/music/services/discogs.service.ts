import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Discogs } from '../../services/api-config';
import { Album, Track } from '../models/album.model';
import { of } from 'rxjs';


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


getTracklist(album: Album): Observable<Track[]> {
  console.log('Fetching tracklist for album:', album.title + ' - MasterID:', album.masterID);
  const url = `${this.discogsConfig.ApiUrl}/masters/${album.masterID}`;
  console.log('Tracklist URL:', url);

  return this.http.get<any>(url).pipe(
    map((response) => {
      
      const tracks = response.tracklist?.map((track: any): Track => ({
        title: track.title || 'Unknown Title',
        length: track.duration || '0:00',
        trackNumber: track.position || '0',
        discNumber: track.disc || 1,
        credits: track.credits || 'Unknown Credits',
        trackImage: track.thumb || 'assets/default-album-art.png',  
        album: album.title || 'Unknown Album',
        artist: album.artist || 'Unknown Artist',
        recordingid: track.recordingid
      
      })) || [];
      return tracks;
    })
  );
  }

  // Get album details by release ID and images separately
  getAlbumDetails(releaseId: string): Observable<Album> {
    const releaseDetailsUrl = `${this.discogsConfig.ApiUrl}/releases/${releaseId}`;
    const masterDetailsUrl = `${this.discogsConfig.ApiUrl}/masters/${releaseId}`;
    const imagesUrl = `${this.localApiBaseUrl}/discogs/images/${releaseId}`;
  
    // Fetch release details first
    return this.http.get<any>(releaseDetailsUrl).pipe(
      map((releaseDetails) => {
        console.log('Release Details Response:', releaseDetails);
        return this.mapDiscogsToAlbumDetails(releaseDetails);
      }),
      switchMap((album) => {
        console.log('Mapped Album (after release details):', album);
        if (!album.tracks || album.tracks.length === 0) {
          return this.http.get<any>(masterDetailsUrl).pipe(
            map((masterDetails) => {
              console.log('Master Details Response:', masterDetails);
              album.tracks = masterDetails.tracklist?.map((track: any): Track => ({
                title: track.title || 'Unknown Title',
                length: track.duration || '0:00',
                trackNumber: track.position || '0',
                discNumber: track.disc || 1,
                trackImage: track.thumb || 'assets/default-album-art.png',
                credits: track.credits || 'Unknown Credits',
                album: masterDetails.title || album.title,
                artist: masterDetails.artists?.[0]?.name || album.artist,
              })) || [];
              console.log('Mapped Tracks (from master):', album.tracks);
              return album;
            })
          );
        }
        return of(album);
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
    console.log('Mapped results:', results);
    return results.map((result) => {
      const [artist, ...titleParts] = result.title.split(' - '); // Split on ' - '
      const title = titleParts.join(' ') || 'Unknown Title'; // Join remaining parts for the title
      return {
        title: title, // Extracted album title
        artist: artist || 'Unknown Artist', // First part becomes the artist
        cat: result.catno || 'N/A', // Handle undefined catalog number
        albumArt: [{ url: result.cover_image || 'assets/default-album-art.png', type: 'Front Cover' }], // Front cover as default
        image: result.cover_image,
        tracks: result.tracklist, // Detailed tracks can be fetched later
        duration: 0, // Placeholder for now
        releaseID: result.id, // Add releaseID from API response
        mediaAvailable: false, // Default to false
        saved: false, // Default to false
        recordLabel: result.label?.[0] || 'Unknown Label', // First label or default
        genre: result.style,
        year: result.year,
        country: result.country,
        label: result.label?.[0] || 'Unknown Label',
        format: result.formats?.[0].name || 'Unknown Format',
        masterID: result.master_id, // Add masterID from API response
      };
    });
  }  
  
  // Static method used elsewhere to Map Discogs album details to Album model
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
        length: (track.length || '0:00'),
        // trackNumber: parseInt(track.position, 10) || 0,
        trackNumber: track.position || 0,
        discNumber: track.disc || 1,
        trackImage: track.thumb || 'assets/default-album-art.png',
        credits: track.credits || 'Unknown Credits',
        album: details.title || 'Unknown Album',
        artist: details.artists?.[0]?.name || 'Unknown Artist',
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

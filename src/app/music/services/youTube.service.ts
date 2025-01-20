import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayList } from '../models/album.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouTubeService {
  private readonly baseUrl = 'http://localhost:3000/api';

  private readonly apiiKey = 'AIzaSyAW5U_46Th2bt3Aed_jn73xiiQj0A9NUvY';

  private readonly apiBaseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=';

  private readonly youTubePlayListURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=';

  private readonly QUERY_URLS = {
    playlistSearch: (artist: string, album: string) =>
      `${this.apiBaseUrl}${artist}+${album}&key=${this.apiiKey}`,

    playlistItems: (playlistId: string) =>
      `${this.youTubePlayListURL}${playlistId}&maxResults=20&key=&key=${this.apiiKey}`
  };

  constructor(private http: HttpClient) { }

  /**
   * Search for playlists based on a query string.
   * @param query The formatted query string.
   * @returns Observable with the search results.
   */

  // New one
  getPlayLists(artist: string, album: string): Promise<any> {
    const apiUrl = this.QUERY_URLS.playlistSearch(artist, album);
    return this.http.get<any>(apiUrl).toPromise().catch((error) => {
      console.error("Error fetching playlists:", error);
      return []; // or throw error;
    });
  }

  searchPlaylists(query: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/youtube/search-playlists?q=${query}`;
    return this.http.get<any>(apiUrl);
  }

  downloadPlaylist(playlistUrl: string, playlistTitle: string): Observable<any> {
    if (!playlistUrl || typeof playlistUrl !== 'string') {
      throw new Error('Invalid URL');
    }
    const payload = { url: playlistUrl, title: playlistTitle };
    console.log('Payload:', payload); // Debugging log
    return this.http.post(`${this.baseUrl}/download/byPlaylist`, payload);
  }

  renameAndUpdateTracks(payload: any): Observable<any> {
    console.log('Payload:', payload);
    return this.http.post(`${this.baseUrl}/files/updateMetadata`, payload);
  }

}



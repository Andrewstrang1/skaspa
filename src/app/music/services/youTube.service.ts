import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouTubeService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Search for playlists based on a query string.
   * @param query The formatted query string.
   * @returns Observable with the search results.
   */
  searchPlaylists(query: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/youtube/search-playlists?q=${query}`;
    return this.http.get<any>(apiUrl);
  }

  downloadPlaylist(playlistUrl: string): Observable<any> {
    if (!playlistUrl || typeof playlistUrl !== 'string') {
      throw new Error('Invalid URL');
    }
    const payload = { url: playlistUrl };
    console.log('Payload:', payload); // Debugging log
    return this.http.post(`${this.baseUrl}/download/byPlaylist`, payload);
  }

  renameAndUpdateTracks(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/rename-and-update`, payload);
  }
   
}

  

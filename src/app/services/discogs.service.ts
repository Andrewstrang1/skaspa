import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discogs } from '../services/api-config'; // Import Discogs config

@Injectable({
  providedIn: 'root',
})
export class DiscogsService {
  private discogsConfig = Discogs[0]; // Use the first Discogs configuration

  constructor(private http: HttpClient) {}

  // Get the request token
  getRequestToken(): Observable<any> {
    const url = this.discogsConfig.RequestTokenURL;
    const params = new HttpParams()
      .set('oauth_consumer_key', this.discogsConfig.ConsumerKey)
      .set('oauth_signature', this.discogsConfig.ConsumerSecret)
      .set('oauth_callback', 'oob'); // Use 'oob' for manual PIN-based auth

    return this.http.post(url, null, { params });
  }

  // Authorize the user with the token received
  getAuthorizeUrl(token: string): string {
    return `${this.discogsConfig.AuthorizeURL}?oauth_token=${token}`;
  }

  // Exchange the request token for an access token
  getAccessToken(oauthVerifier: string, token: string): Observable<any> {
    const url = this.discogsConfig.AccessTokenURL;
    const params = new HttpParams()
      .set('oauth_consumer_key', this.discogsConfig.ConsumerKey)
      .set('oauth_token', token)
      .set('oauth_verifier', oauthVerifier)
      .set('oauth_signature', this.discogsConfig.ConsumerSecret);

    return this.http.post(url, null, { params });
  }

  // Search for an album by artist and title
  searchAlbum(artist: string, album: string): Observable<any> {
    const url = `${this.discogsConfig.ApiUrl}/database/search`;
    const params = new HttpParams()
      .set('q', `${artist} ${album}`)
      .set('type', 'release')
      .set('key', this.discogsConfig.ConsumerKey)
      .set('secret', this.discogsConfig.ConsumerSecret);

    return this.http.get(url, { params });
  }

  // Get detailed album information
  getAlbumDetails(releaseId: string): Observable<any> {
    const url = `${this.discogsConfig.ApiUrl}/releases/${releaseId}`;
    return this.http.get(url);
  }
}

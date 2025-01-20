import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UriBuilderService {
  private configurations: any;
  private baseUrl: string = '';

  constructor(private http: HttpClient) {
    // Simulating the configuration loading from `preferences.json`.
    this.configurations = {
      LastFmConfig: {
        ApiKey: 'b9f058a6a93bc4155bbfe8be5363f1a8',
        SharedSecret: '807321b30846b75c581faf791c44d914',
        ApiUrl: 'http://ws.audioscrobbler.com/2.0/',
      },
      DiscogsConfig: {
        ApiUrl: 'https://api.discogs.com',
        ConsumerKey: 'rdzRnzytYaVXQMZLoCKA',
        ConsumerSecret: 'YekDUvRyopeCygVaWIjVhkAwJgnRYHHW',
      },
      MusicBrainzConfig: {
        ApiUrl: 'https://musicbrainz.org/ws/2/',
      },
      ShazamApiConfig: {
        ApiUrl: 'https://shazam.p.rapidapi.com',
        ApiKey: 'b5dd3059b1mshb1c48325984e6ffp15c0acjsn46a52b9c45bf',
        ApiHost: 'shazam.p.rapidapi.com',
      },
    };
  }

  getConfiguration(configKey: string): any {
    return this.configurations[configKey];
  }

  /**
   * Build query string for API requests.
   */
  private buildQueryParams(params: { [key: string]: string }): HttpParams {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.append(key, params[key]);
    });
    return queryParams;
  }

  /**
   * Create request headers dynamically.
   */
  private buildHeaders(headers: { [key: string]: string }): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    Object.keys(headers).forEach((key) => {
      httpHeaders = httpHeaders.append(key, headers[key]);
    });
    return httpHeaders;
  }

  /**
   * Build the full API URL with query parameters.
   */
   buildRequestUrl(baseUrl: string, params: { [key: string]: string }): string {
    const queryString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return `${baseUrl}?${queryString}`;
  }

  /**
   * Get API URL for LastFM Search.
   */
  getLastFmArtistSearchUrl(searchTerm: string): string {
    const config = this.configurations.LastFmConfig;
    return this.buildRequestUrl(config.ApiUrl, {
      method: 'artist.getTopAlbums',
      artist: searchTerm,
      api_key: config.ApiKey,
      format: 'json',
    });
  }
  getLastFmAlbumTracksUrl(artist: string, album: string): string {
    const config = this.getConfiguration('LastFmConfig');
    return this.buildRequestUrl(config.ApiUrl, {
      method: 'album.getinfo',
      artist,
      album,
      api_key: config.ApiKey,
      format: 'json',
    });
  }

  /**
   * Fetch data for MusicBrainz.
   */
  getMusicBrainzArtistSearch(searchTerm: string): Observable<any> {
    const config = this.configurations.MusicBrainzConfig;
    const url = this.buildRequestUrl(config.ApiUrl + 'release/', {
      query: `artist:"${searchTerm}"`,
      fmt: 'json',
    });
    return this.http.get(url);
  }

  /**
   * Fetch data for Discogs.
   */
  getDiscogsArtistReleases(artist: string): Observable<any> {
    const config = this.configurations.DiscogsConfig;
    const url = this.buildRequestUrl(config.ApiUrl + '/database/search', {
      artist,
      key: config.ConsumerKey,
      secret: config.ConsumerSecret,
      format: 'LP',
      country: 'UK',
    });
    return this.http.get(url);
  }

  /**
   * Fetch data for Shazam.
   */
  getShazamSearchArtist(searchTerm: string): Observable<any> {
    const config = this.configurations.ShazamApiConfig;
    const headers = this.buildHeaders({
      'X-RapidAPI-Key': config.ApiKey,
      'X-RapidAPI-Host': config.ApiHost,
    });
    const url = this.buildRequestUrl(config.ApiUrl + '/search', {
      term: searchTerm,
      locale: 'en-US',
      offset: '0',
      limit: '5',
    });
    return this.http.get(url, { headers });
  }

  /**
   * Generic HTTP GET request method.
   */
  apiGet<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  /**
   * Generic HTTP request method with dynamic headers.
   */
  apiSend<T>(url: string, headers?: { [key: string]: string }): Observable<T> {
    const httpHeaders = headers ? this.buildHeaders(headers) : new HttpHeaders();
    return this.http.get<T>(url, { headers: httpHeaders });
  }

  
}

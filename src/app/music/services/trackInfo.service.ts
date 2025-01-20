import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Album, Track } from '../models/album.model';


@Injectable({
  providedIn: 'root',
})
export class TrackInfoService {
  private readonly baseUrl = 'http://localhost:3000/api/musicbrainz';

  constructor(private http: HttpClient) { }

  /**
   * Fetch track information by track name and artist name.
   * @param trackName Name of the track
   * @param artistName Name of the artist
   * @returns Observable with the MusicBrainz response
   */
  getTrackInfo(trackName: string, artistName: string): Observable<any> {
    const query = `recording:"${trackName}" AND artist:"${artistName}"`;
    const url = `${this.baseUrl}/trackinfo?query=${encodeURIComponent(query)}`;

    console.log('Sending request to:', url);

    return this.http.get<any>(url).pipe(
      tap((data) => console.log('Received response:', data)),
      catchError((error) => {
        console.error('Error in TrackInfoService:', error);
        throw error;
      })
    );
  }

  getAlbumData(artistName: string, albumTitle: string): Observable<any> {
    const url = `${this.baseUrl}scraper/top-20-releases?q=${artistName} - ${albumTitle}`;
    console.log('Sending request to:', url);

    return this.http.get<any>(url).pipe(
      map((data) => this.mapresponseToAlbums(data)),  // Map the response to an array of albums
      catchError((error) => {
        console.error('Error in TrackInfoService:', error);
        throw error;
      })
    );
  }

  /**
   * Using this format map the response from MusicBrainz API to our custom format
   *    "releaseId": "3c9f5cc8-9fa0-4257-b3ce-4af73578c22b",
        "title": "The Other Side",
        "link": "https://musicbrainz.org/release/3c9f5cc8-9fa0-4257-b3ce-4af73578c22b",
        "artist": "Nektar",
        "comment": "(a division of Cherry Red)",
        "country": "XE",
        "year": "2020",
        "format": "CD",
        "catalog": null,
        "label": "Esoteric Antenna",
        "coverArtPageLink": "https://musicbrainz.org/release/3c9f5cc8-9fa0-4257-b3ce-4af73578c22b/cover-art",
        "score": 60,
        "trackdata": [
            {
                "title": "I’m on Fire",
                "credits": "",
                "length": "8:33",
                "trackNumber": 1
            },
            {
                "title": "Skywriter",
                "credits": "",
                "length": "7:52",
                "trackNumber": 2
            },
            
        ],
        "coverLink": "https://archive.org/download/mbid-3c9f5cc8-9fa0-4257-b3ce-4af73578c22b/mbid-3c9f5cc8-9fa0-4257-b3ce-4af73578c22b-25234484422_thumb250.jpg"
    }
   */

  private mapresponseToAlbums(results: any[]): Album[] {
    if (!Array.isArray(results)) {
      console.log('Results:', results);
      console.error('results is not an array');
      return [];
    }
    console.log('Results:', results);
    return results.map((result) => {
      return {
        releaseID: result.releaseId,
        title: result.title, // Extracted album title
        artist: result.artist || 'Unknown Artist', // First part becomes the artist
        cat: result.catalog || 'N/A', // Handle undefined catalog number
        albumArt: [{ url: result.coverLink || 'assets/default-album-art.png', type: 'Front Cover' }], // Front cover as default
        image: result.coverLink,
        tracks: result.trackdata,   
        duration: 0, // Placeholder for now
        mediaAvailable: false, // Default to false
        saved: false, // Default to false
        recordLabel: result.label?.[0] || null, // First label or default
        genre: result.style,
        year: result.year,
        country: result.country,
        label: result.label || null,
        link: result.link,
        coverArtPageLink: result.coverArtPageLink || null,
        format: result.format,
        coverLink: result.coverLink || null,
      };
    });
  }
  /**
   * Find the best release for a track based on album title.
   * @param trackResponse Full response from MusicBrainz API
   * @param albumTitle The target album title
   * @returns The best release object or null
   */
  getBestRelease(trackResponse: any, albumTitle: string): any {
    if (!trackResponse || !trackResponse.recordings) {
      console.warn('No recordings found in response.');
      return null;
    }

    for (const recording of trackResponse.recordings) {
      const releases = recording.releases || [];
      const matchingRelease = releases.find(
        (release: any) =>
          release['release-group']?.title?.toLowerCase() === albumTitle.toLowerCase()
      );

      if (matchingRelease) {
        return {
          recording,
          release: matchingRelease,
        };
      }
    }

    console.warn(`No matching release found for album title: ${albumTitle}`);
    return null;
  }

  getContributors(recordingId: string): Observable<any> {
    const url = `http://localhost:3000/api/musicbrainz/contributors?id=${recordingId}`;

    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching contributors:', error);
        throw error;
      })
    );
  }

}

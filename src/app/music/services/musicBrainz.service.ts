import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Album } from '../models/album.model';


@Injectable({
  providedIn: 'root',
})
export class MusicBrainzService {
  private readonly BASE_URL = 'musicbrainz.org/ws/2';
  private readonly COVER_ART_ARCHIVE_URL = 'http://coverartarchive.org/release';
  private readonly PROXY_URL = 'http://localhost:3000/api/proxy/all';

  private readonly QUERY_URLS = {
    releaseDetails: (artist: string, album: string) =>
      `${this.PROXY_URL}?q=${this.BASE_URL}/release/?query=artist:${artist} AND release:${album}&fmt=json`,

    releaseInfo: (releaseId: string) =>
      `${this.PROXY_URL}?q=${this.BASE_URL}/release/${releaseId}?inc=recordings+artist-credits+work-rels&fmt=json`,

    coverArt: (releaseId: string) => `${this.COVER_ART_ARCHIVE_URL}/${releaseId}`,
  };

  constructor(private http: HttpClient) {}

  searchAlbumByArtist(artist: string, album: string): Observable<Album[]> {
    console.log(`Fetching release details for album '${album}' by artist '${artist}'...`);
    const url = this.QUERY_URLS.releaseDetails(artist, album);
    console.log(`Fetching release details from URL: ${url}`);
  
    return this.http.get<any>(url).pipe(
      switchMap((response): Observable<Album[]> => {
        if (response.releases) {
          console.log('Releases retrieved:', response.releases);
  
          // Map each release to an observable of Album
          const releaseObservables: Observable<Album>[] = response.releases.map((release: any) =>
            this.getReleaseDetails(release.id).pipe(
              switchMap((details) =>
                this.getCoverArt(release.id).pipe(
                  map((art) => this.mapReleaseToAlbum(release, details, art))
                )
              )
            )
          );  
          // Combine all release observables into a single observable emitting an array of Albums
          return forkJoin(releaseObservables);
        } else {
          //console.warn('No releases found for the given artist and album.');
          return of([]); // Return an empty array as Observable<Album[]>
        }
      }),
      catchError((error): Observable<Album[]> => {
        console.error('Error fetching release details:', error);
        return of([]); // Ensure consistent return type
      })
    );
  }
  

  getReleaseDetails(releaseId: string): Observable<any> {
    const url = this.QUERY_URLS.releaseInfo(releaseId);
    console.log(`Fetching release details from URL: ${url}`);
    return this.http.get<any>(url).pipe(
      map((response) => {
        return {
          id: response.id,
          title: response.title,
          date: response.date,
          country: response.country,
          tracks: response.media?.[0]?.tracks?.map((track: any) => ({
            title: track.title,
            length: this.formatDuration(track.length) || track.length,
            recordingId: track.id,
            trackNumber: track.position,
          })) || [],
          artistCredits: response['artist-credit']?.map((artist: any) => artist.name).join(', '),
        };
      }),
      catchError((error) => {
        console.error(`Error fetching details for release ID: ${releaseId}`, error);
        return of(null);
      })
    );
  }

  private getCoverArt(releaseId: string): Observable<any> {
    const url = this.QUERY_URLS.coverArt(releaseId);
    return this.http.get<any>(url).pipe(
      map((response) => {
        const frontCover = response.images.find((img: any) => img.front)?.image;
        const allArt = response.images.map((img: any) => ({
          url: img.image,
          type: img.types.join(', '),
        }));
        return { frontCover, allArt };
      }),
      catchError(() => {
        //console.warn(`No cover art found for release ID: ${releaseId}`);
        return of({
          frontCover:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vinyl_record.svg/240px-Vinyl_record.svg.png',
          allArt: [],
        });
      })
    );
  }

  private mapReleaseToAlbum(release: any, details: any, art: any): Album {
    return {
      title: release.title,
      artist: details.artistCredits || 'Unknown Artist',
      cat: release['media']?.[0]?.catalog_number || 'Unknown Catalog',
      albumArt: art.allArt || [],
      tracks: details.tracks || [],
      duration: details.tracks?.reduce((sum: number, track: any) => sum + track.length, 0) || 0,
      releaseID: release.id,
      mediaAvailable: !!details.tracks?.length,
      saved: false,
      label: release['label-info']?.[0]?.label?.name || 'Unknown Label',
      image: art.frontCover || '',
      year: release.date?.split('-')[0] || 'Unknown Year',
      country: release.country || 'Unknown Country',
      genre: '', // Add genre mapping logic if applicable
      link: `https://musicbrainz.org/release/${release.id}`,
      format: release['media']?.[0]?.format || 'Unknown Format',
      coverArtPageLink: `https://musicbrainz.org/release/${release.id}/cover-art`,
      trackCount: details.tracks?.length || 0,
    };
  }

  private formatDuration(ms: number): string {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
  }

}

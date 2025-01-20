import { Injectable } from '@angular/core';
interface TrackMap {
  [track: string]: number;
}
@Injectable({
  providedIn: 'root'
})
export class TrackNumberService {

  public createTrackMap(tracks: string[]): TrackMap {
    const trackMap: TrackMap = {};

    let cdTrackNumber = 1;

    tracks.forEach((track) => {
      // make sure the track number is not undefined
      if (typeof track === 'string') {
        const side = track.charAt(0);
        const trackNumber = parseInt(track.charAt(1));
      }   
      trackMap[track] = cdTrackNumber;

      cdTrackNumber++;
    });

    return trackMap;
  } 
}
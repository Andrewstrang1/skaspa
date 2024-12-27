import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrackNumberService {
  private sideToTrackMap: { [vinylTrackNumber: string]: number } = {};

  /**
   * Translates vinyl track numbers to CD track numbers.
   * @param vinylTracks An array of vinyl track numbers (e.g., ["A1", "A2", "B1", "B2"])
   */
  processVinylTracks(vinylTracks: string[]): void {
    this.sideToTrackMap = {}; // Reset the map
    let cdTrackCounter = 1; // Start CD track numbers from 1

    vinylTracks.forEach((vinylTrack) => {
      this.sideToTrackMap[vinylTrack] = cdTrackCounter++;
    });
  }

  /**
   * Gets the CD track number for a given vinyl track number.
   * @param vinylTracks The entire array of vinyl tracks (e.g., ["A1", "A2", "B1", "B2"]).
   * @param vinylTrackNumber The specific vinyl track number to be translated (e.g., "B2").
   * @returns The CD track number (e.g., 4 for "B2") or -1 if not found.
   */
  getCdTrackNumber(vinylTracks: string[], vinylTrackNumber: string): number {
    if (!this.sideToTrackMap[vinylTrackNumber]) {
      this.processVinylTracks(vinylTracks);
    }

    return this.sideToTrackMap[vinylTrackNumber] || -1;
  }

  /**
   * Retrieves the mapping of all vinyl track numbers to CD track numbers.
   * @returns The map of vinyl to CD track numbers.
   */
  getAllMappings(): { [vinylTrackNumber: string]: number } {
    return this.sideToTrackMap;
  }
}

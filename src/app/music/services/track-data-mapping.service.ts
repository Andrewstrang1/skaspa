import { Injectable } from '@angular/core';
import { Track } from '../models/album.model';
import { InstrumentList } from '../models/musical.instruments.list';

@Injectable({
  providedIn: 'root',
})
export class TrackDataMappingService {
  private instruments = InstrumentList;

  private parsePerformers(rawData: string): string {
    const performerLines = rawData.split('\n').filter(line => {
      return this.instruments.some(inst => line.includes(inst));
    });

    const performers = performerLines.map(line => {
      const parts = line.split(':');
      const instrument = parts[0].trim();
      const performer = parts[1]?.replace(/\(.*?\)/g, '').trim(); // Remove descriptions in parentheses
      return `${performer}: ${instrument}`;
    });

    return performers.join(', ');
  }

  private parseProducers(rawData: string): string {
    const producerLines = rawData.split('\n').filter(line => line.startsWith('producer:'));
    const producers = producerLines.map(line => line.replace('producer:', '').trim());
    return producers.join(', ');
  }

  private parseComposers(rawData: string): string {
    const composerLines = rawData.split('\n').filter(line => line.startsWith('composer:') || line.startsWith('lyricist:'));
    const composers = composerLines.map(line => line.replace(/composer:|lyricist:/g, '').replace(/\(.*?\)/g, '').trim());
    return composers.join(', ');
  }

  mapToTracks(rawDataArray: string[]): Track[] {
    return rawDataArray.map(rawData => {
      const [title, ...details] = rawData.split('\n');
      const detailsString = details.join('\n');

      return {
        title: title.trim(),
        length: '', // Duration is not present in the scraped data
        trackNumber: '', // Could be derived if necessary
        discNumber: 1, // Assuming disc 1 by default
        credits: this.parsePerformers(detailsString) + '\n' + this.parseProducers(detailsString) + '\n' + this.parseComposers(detailsString),
        artist: null,
        album: null,
      };
    });
  }
}

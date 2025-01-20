import { Component, OnInit } from '@angular/core';
import { MusicBrainzService } from '../../music/services/musicBrainz.service';
import { DiscogsService } from '../../music/services/discogs.service';
@Component({
  selector: 'app-musictest',
  templateUrl: './musictest.component.html',
  styleUrls: ['./musictest.component.css']
})
export class MusictestComponent implements OnInit {

  artist: string = '';
  albumTitle: string = '';
  results: any;
  ngOnInit(): void { }

  selecetdAPI: string = 'MusicBrainz';

  constructor(private musicBrainzService: MusicBrainzService, private discogsService: DiscogsService) {}

  // fetchReleases based on which API is selected
  fetchReleases(): void {
    console.log(this.selecetdAPI);
    if (this.selecetdAPI === 'MusicBrainz') {
      this.fetchReleasesFromMusicBrainz();
    } else if (this.selecetdAPI === 'Discogs') {
      this.fetchReleasesFromDiscogs();
    }
  }



  fetchReleasesFromMusicBrainz(): void {
    if (this.artist && this.albumTitle) {
      console.log(this.artist, this.albumTitle);
      this.musicBrainzService.searchAlbumByArtist(this.artist, this.albumTitle).subscribe(
        (data) => {
          // filter out results that are have 
          this.results = data;
        },
        (error) => {
          console.error('Error fetching releases:', error);
          this.results = { error: 'Failed to fetch data.' };
        }
      );
    } else {
      this.results = { error: 'Please provide both artist and album title.' };
    }
  }

  fetchReleasesFromDiscogs(): void {
    if (this.artist && this.albumTitle) {
      this.discogsService.searchAlbum(this.artist, this.albumTitle).subscribe(
        (data) => {
          this.results = data;

          // select an album that is a CD and is a UK release, if none match just select the first one
          const selectedAlbum = data.find((album) => {
            return (              
              album.format  === 'CD' &&
              (album.country === 'UK' || album.country === 'GB')
            );
          }) || data[0];
          if (selectedAlbum) {
            console.log('Selected album:', selectedAlbum);
            this.discogsService.getAlbumDetails(selectedAlbum.releaseID).subscribe(
              (details) => {
                console.log('Album details:', details);
                this.results = details;
              },
              (error) => {
                console.error('Error fetching album details:', error);
                this.results = { error: 'Failed to fetch data.' };
              }
            )
          }            
            
        },
        (error) => {
          console.error('Error fetching releases:', error);
          this.results = { error: 'Failed to fetch data.' };
        }
      );
    } else {
      this.results = { error: 'Please provide both artist and album title.' };
    }
  }
}

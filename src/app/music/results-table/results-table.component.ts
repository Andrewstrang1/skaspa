import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscogsService } from '../services/discogs.service';
import { SearchCriteriaService } from '../services/search-criteria.service';
import { Album } from '../models/album.model';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { DataServicesService } from '../../services/data-services.service';
import { TrackInfoService } from '../services/trackInfo.service';
import { AlbumService } from '../services/album.service';
import { MusicBrainzService } from '../services/musicBrainz.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
})
export class ResultsTableComponent implements OnInit {
  searchCriteria: any;
  results: Album[] = [];
  loading: boolean = false;
  title: string = '';
  displayedColumns= ['releaseID', 'year', 'country', 'label', 'format'];
  album: Album | null = null;
  spinnerText = 'Loading Albums from MusicBrainz - this may take a few moments'; // No elipses
  spinnerTheme = 'purple-theme';
  
  actionButtons: ActionButton[] = [
    {
      label: 'View Details',
      iconPath: '', // SVG path for an icon
      location: 'row', // Action is specific to tile or both
      handler: (row: any) => {
        console.log('View Details:', row);
        this.viewDetails(row); // Custom method
      },
    }
  ]; 

  constructor(
    private discogsService: DiscogsService,
    private searchCriteriaService: SearchCriteriaService,
    private router: Router,
    private route: ActivatedRoute,

    private albumService: AlbumService, 
    private musicBrainzService: MusicBrainzService
    
  ) {}

  ngOnInit(): void {
    this.searchCriteriaService.searchCriteria$.subscribe((criteria) => {
      console.log('Search criteria:', criteria);
      if (criteria === null) {
        console.log('No search criteria');
        return};

      this.searchCriteria = criteria;
          // check that there is a search criteria
      
      this.fetchAlbumsFromMusicBrainz();
    });
  }

  fetchResultsfromDiscogs() {
    if (!this.searchCriteria) return;

    this.loading = true;
    this.discogsService
      .searchAlbum(this.searchCriteria.artist, this.searchCriteria.title)
      .subscribe({
        next: (results) => {
          this.results = results;
          console.log ('Mapped results:', results)
          this.title = 'Results for ' + this.searchCriteria.artist + ' ' + this.searchCriteria.title
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching results:', err);
          this.loading = false;
        },
      });
  }

  fetchAlbumsFromMusicBrainz() {

    this.loading = true;
    console.log(this.searchCriteria.artist, this.searchCriteria.title);
    this.musicBrainzService
      .searchAlbumByArtist(this.searchCriteria.artist, this.searchCriteria.title)
      .subscribe({
        next: (result: any) => {
          this.results = result;
          console.log ('Mapped results:', result)
          this.title = 'Results for ' + this.searchCriteria.artist + ' - ' + this.searchCriteria.title
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching results:', err);
          this.loading = false;
        },
      })
    
  }

  
  /**
   * Fetches album data from MusicBrainz API.
   * 
   * This is the main entry point for searching for albums.
   * 
   * @param artist Artist name
   * @param title Album title
   * @returns an Observable of the album data
   */
  // fetchAlbumsFromMusicBrainzOld() {

  //   this.loading = true;
  //   this.trackInfoService
  //     .getAlbumData(this.searchCriteria.artist, this.searchCriteria.title)
  //     .subscribe({
  //       next: (results: any) => {
  //         this.results = results;
  //         console.log ('Mapped results:', results)
  //         this.title = 'Results for ' + this.searchCriteria.artist + ' - ' + this.searchCriteria.title
  //         this.loading = false;
  //       },
  //       error: (err: any) => {
  //         console.error('Error fetching results:', err);
  //         this.loading = false;
  //       },
  //     })
  // }
viewDetails(album: Album) {
  this.albumService.setAlbum(album);
  console.log ('Album: ', album);
  console.log ('ReleaseID: ', album.releaseID );
  this.router.navigate(['../details'], { relativeTo: this.route });
}
}

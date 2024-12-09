import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DiscogsService } from '../services/discogs.service';
import { SearchCriteriaService } from '../services/search-criteria.service';
import { Album } from '../models/album.model';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { DataServicesService } from '../../services/data-services.service';

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
  displayedColumns= ['cat', 'genre', 'releaseID', 'year', 'country', 'label'];
  
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchCriteriaService.searchCriteria$.subscribe((criteria) => {
      this.searchCriteria = criteria;
      this.fetchResultsfromDiscogs();
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

  viewDetails(album: Album) {
    console.log ('ReleaseID: ', album.releaseID );
    this.router.navigate(['music/details', album.releaseID], {
      state: { album },
    });
  }
}

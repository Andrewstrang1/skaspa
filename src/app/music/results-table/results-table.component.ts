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

  actionButtons: ActionButton[] = [
    {
      label: 'View Details',
      iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', // SVG path for an icon
      location: 'tile', // Action is specific to tile or both
      handler: (row: any) => this.viewDetails(row), // Function to execute
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
      this.fetchResults();
    });
  }

  fetchResults() {
    if (!this.searchCriteria) return;

    this.loading = true;
    this.discogsService
      .searchAlbum(this.searchCriteria.artist, this.searchCriteria.title)
      .subscribe({
        next: (results) => {
          this.results = results;
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
    this.router.navigate(['music/details', album.catalogNumber], {
      state: { album },
    });
  }
}

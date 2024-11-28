import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DiscogsService } from '../services/discogs.service';
import { SearchCriteriaService } from '../services/search-criteria.service';
import { Album } from '../models/album.model';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
})
export class ResultsTableComponent implements OnInit {
  searchCriteria: any;
  results: Album[] = [];
  loading: boolean = false;

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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchCriteriaService } from '../services/search-criteria.service';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { DataServicesService } from '../../services/data-services.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
})
export class ResultsTableComponent implements OnInit {
  searchCriteria: any = {}; // To store search criteria
  results: any[] = []; // To store search results
  loading: boolean = false; // For showing a spinner during data fetch

  constructor(
    private router: Router,
    private searchCriteriaService: SearchCriteriaService,
    private dataService: DataServicesService
  ) {}

  tableData: any[] = this.dataService.getSampleData();
  displayedColumns = ['id', 'name', 'status'];
  selectable = false; // Enable checkbox column
  showHamburgerMenu = false; // Show row dropdown menu for actions
  showRating = true; //Optional column for product rating 

 

  ngOnInit(): void {
    // Fetch the search criteria from the shared service
    this.searchCriteria = this.searchCriteriaService.getSearchCriteria();

    if (this.searchCriteria) {
      this.fetchResults();
    } else {
      console.error('No search criteria provided!');
      this.results = []; // Clear results if no criteria
    }
  }

  fetchResults() {
    this.loading = true;
    console.log('Fetching results for:', this.searchCriteria);

    // Simulate a data fetch with a timeout
    setTimeout(() => {
      this.results = [
        { artist: this.searchCriteria.artist, title: 'Title A', catalogNumber: '001' },
        { artist: 'Artist B', title: 'Title B', catalogNumber: '002' },
      ];
      this.loading = false;
    }, 1500);
  }

  viewDetails(row: any) {
    console.log('Navigating to details for row:', row);
    this.router.navigate(['music/details', row.catalogNumber]);
  }
}

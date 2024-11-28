// search.form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { SearchCriteriaService } from '../services/search-criteria.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent {
  searchCriteria = {
    artist: '',
    title: '',
    catalogNumber: '',
  };

  constructor(private searchCriteriaService: SearchCriteriaService) {}

  @Output() search = new EventEmitter<any>();

  onSearch() {
    console.log('Search criteria from SearchFormComponent:', this.searchCriteria);

    // Save the criteria in the service
    this.searchCriteriaService.setSearchCriteria(this.searchCriteria);

    // Emit search event for parent listeners
    this.search.emit(this.searchCriteria);

    // Optionally navigate directly to the results page from here
    // this.router.navigate(['music/results']);
  }
}

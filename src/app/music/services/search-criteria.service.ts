import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchCriteriaService {
  private searchCriteriaSubject = new BehaviorSubject<any>(null);
  searchCriteria$ = this.searchCriteriaSubject.asObservable();

  setSearchCriteria(criteria: any): void {
    this.searchCriteriaSubject.next(criteria);
  }

  getSearchCriteria(): any {
    console.log('Search criteria:', this.searchCriteriaSubject.getValue());
    return this.searchCriteriaSubject.getValue();
  }
}

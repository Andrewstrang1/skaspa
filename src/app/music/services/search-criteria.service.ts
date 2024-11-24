import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchCriteriaService {
  private searchCriteriaSubject = new BehaviorSubject<any>(null);
  searchCriteria$ = this.searchCriteriaSubject.asObservable();

  setSearchCriteria(criteria: any): void {
    console.log ('Service received data:', criteria)
    this.searchCriteriaSubject.next(criteria);
  }

  getSearchCriteria(): any {
    console.log ('fetching from service')
    return this.searchCriteriaSubject.getValue();
  }
}

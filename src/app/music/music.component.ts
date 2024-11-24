import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchCriteriaService } from './services/search-criteria.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css'],
})
export class MusicComponent implements OnInit {
  constructor(
    private router: Router,
    private searchCriteriaService: SearchCriteriaService
  ) {}

  ngOnInit(): void {
    this.searchCriteriaService.searchCriteria$.subscribe((criteria) => {
      if (criteria) {
        console.log('Search criteria received in MusicComponent:', criteria);

        // Navigate to results
        this.router.navigate(['music/results']).catch((err) => {
          console.error('Navigation Error:', err);
        });
      }
    });
  }
}

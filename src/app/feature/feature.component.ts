import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route], { relativeTo: this.activatedRoute }); // Relative navigation
    }
  }
  

  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value; // Cast to HTMLSelectElement
    this.navigateTo(value);
  }
  ngOnInit(): void {
  }

}

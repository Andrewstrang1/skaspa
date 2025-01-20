import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-dropdown',
  templateUrl: './navigation-dropdown.component.html',
  styleUrls: ['./navigation-dropdown.component.css']
})
export class NavigationDropdownComponent implements OnInit {

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }


  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value; // Cast to HTMLSelectElement
    this.navigateTo(value);
  }

  ngOnInit(): void {
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  featureLinks = [
    { label: 'Datatable Examples', path: '/feature' },
    { label: 'Feature 2', path: '/feature2' },
    { label: 'Feature 3', path: '/feature3' },
    // Add more links as needed
  ];
}

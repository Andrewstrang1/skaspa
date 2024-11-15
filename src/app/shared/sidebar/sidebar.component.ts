import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  featureLinks = [
    { label: 'Datatable Examples', path: '/feature' },
    { label: 'Music', path: '/feature/music' },
    { label: 'Feature 3', path: '/feature3' },
    // Add more links as needed
  ];
}

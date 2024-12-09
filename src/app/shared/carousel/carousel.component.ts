import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css', '../shared-styles/data-table-h-purple-theme.css', 
    '../shared-styles/data-table-h-blue-theme.css', '../shared-styles/data-table-h-green-theme.css'] // Include all theme files
})
export class CarouselComponent implements OnInit {
  @Input() images: { url: string; type: string }[] = [];
  @Input() themeClass: string = 'blue-theme'; // Default theme

  constructor() {}

  ngOnInit(): void {
    console.log('Album Art passed to carousel:', this.images);
    console.log('Theme Class:', this.themeClass);
  }
}

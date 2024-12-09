import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-feature',
  templateUrl: './sub-feature.component.html',
  styleUrls: ['./sub-feature.component.css']
})
export class SubFeatureComponent implements OnInit {
  images = [
    { url: 'https://via.placeholder.com/600x400', type: 'Front Cover' },
    { url: 'https://via.placeholder.com/600x400', type: 'Back Cover' },
    { url: 'https://via.placeholder.com/600x400', type: 'insode Cover' },
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}

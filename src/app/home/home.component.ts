import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  albumArt = [
    { url: 'https://via.placeholder.com/600x400', type: 'Front Cover' },
    { url: 'https://via.placeholder.com/600x400', type: 'Back Cover' },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}

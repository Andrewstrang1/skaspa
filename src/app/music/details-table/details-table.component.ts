import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../models/album.model';
import { formatDuration } from '../../utility/utility';


@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.css'],
})


export class DetailsTableComponent implements OnInit {
  album: Album | null = null;

  constructor(private route: ActivatedRoute) {}
  formatDuration = formatDuration;
  ngOnInit(): void {
    const state = history.state;
    this.album = state.album || null;

    if (!this.album) {
      console.error('No album data provided!');
    }
  }
  
}

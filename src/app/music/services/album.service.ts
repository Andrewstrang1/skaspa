// album.service.ts
import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private album!: Album;

  setAlbum(album: Album) {
    this.album = album;
  }

  getAlbum(): Album {
    return this.album;
  }
}
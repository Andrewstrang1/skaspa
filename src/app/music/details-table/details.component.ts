import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscogsService } from '../services/discogs.service';
import { Album } from '../models/album.model';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  album: Album | null = null; // Store album details
  loading: boolean = true;
  themeClass: string = 'purple-theme';
  isImagesLoaded: boolean = false; // Tracks whether images are loaded
  actionButtons: ActionButton[] = [
    {
      label: 'Edit',
      iconPath: 'M3 12l18 12-18 12',  // SVG path for edit icon
      handler: (row) => this.editTrack(row),
      location: 'row',  // Only in row dropdown
      modal: true,  // Opens modal
      emitOnSave: true
    },];

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discogsService: DiscogsService
  ) {}

  ngOnInit(): void {
    const releaseID = this.route.snapshot.paramMap.get('id'); // Retrieve the releaseID
    const navigation = this.router.getCurrentNavigation();
    this.themeClass = 'purple-theme'; // Example
    // Safe navigation state typing
    const state = navigation?.extras?.state as { album?: Album };

    if (state?.album) {
      // Use the album object from the navigation state if available
      this.album = state.album;
      console.log('Album loaded from navigation state:', this.album);
    } else if (releaseID) {
      // Fallback: Fetch the album details using releaseID
      console.log('Fetching album details for releaseID:', releaseID);
      this.fetchAlbumDetails(releaseID);
    } else {
      console.error('No releaseID or album data provided');
    }
  }

  fetchAlbumDetails(releaseID: string): void {
    this.loading = true;
    this.discogsService.getAlbumDetails(releaseID).subscribe({
      next: (data) => {
        this.album = data;
        this.loading = false;
        // Check if images exist and are valid
        if (this.album.albumArt && this.album.albumArt.length > 0) {
          this.isImagesLoaded = true;
        }
        console.log("Album Details:", this.album);
        console.log('Album Artwork:', this.album?.albumArt);
      },
      error: (err) => {
        console.error('Error fetching album details:', err);
        this.loading = false;
      }
    });
  }
  uploadImage() {
    console.log('Upload image button clicked.');
    // TODO: Implement image upload logic with confirmation popup for replacement
  }

  searchImages() {
    console.log('Search for more images button clicked.');
    // TODO: Implement image search logic
  }

  editTrack(track: any) {
    console.log('Edit track:', track);
    // TODO: Implement track editing logic
  }
  // Navigation back to results
  goBack(): void {
    this.router.navigate(['music/results']);
  }

  // Save the album details
  saveAlbum(): void {
    if (this.album) {
      console.log('Save album:', this.album);
      // Implement save logic (e.g., local storage or API)
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscogsService } from '../services/discogs.service';
import { Album, AlbumArt, Track, PlayList } from '../models/album.model';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { YouTubeService } from '../services/youTube.service';
import { TrackFileService } from '../services/track-file.service';
import { FileMapService } from '../services/fileMapservice';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css', '../../shared/shared-styles/data-table-h-purple-theme.css']
})
export class DetailsComponent implements OnInit {

  album: Album | null = null; // Store album details
  loading: boolean = true;
  playListsLoading = true;
  filesLoading = false;
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
    actionButtonsPlaylists: ActionButton[] = [
      {
        label: 'View',
        iconPath: 'M3 12l18 12-18 12', // SVG Path (optional, replace with actual if needed)
        handler: (row) => this.viewPlaylist(row),
        location: 'row', // Displays in the hamburger menu
        modal: false, // Doesn't open a modal
        emitOnSave: false, // No save emit needed
      },
      {
        label: 'Download',
        iconPath: 'M3 12l18 12-18 12', // SVG Path (optional, replace with actual if needed)
        handler: (row) => this.downloadPlaylist(row),
        location: 'row', // Displays in the hamburger menu
        modal: false, // Doesn't open a modal
        emitOnSave: false, // No save emit needed
      },
    ];
    
    // Variables for tabs
    activeTab: number = 0; // Tracks tab as default
    playlists: PlayList[] = []; // Placeholder for playlists data
    showHeaderFooterTracks: boolean = false;
    showHeaderFooterPlaylists: boolean = false;
    pageSizeTracks: number = 15;
    pageSizePlaylists: number = 8;
    files: any[] = []; // Store files from the downloaded playlist
    trackToFileMapping: { [key: string]: any } = {}; // Map tracks to files
    statusMessage: string = '';
    messages: string[] = []; // Array to hold server messages

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discogsService: DiscogsService,
    private youTubeService: YouTubeService,
    private trackFileService: TrackFileService,
    private fileMapService: FileMapService  ) { }

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
  onTabChange(index: number): void {
    this.activeTab = index;
    console.log('Active Tab:', this.activeTab);
  }

  ngOnChanges() {
    console.log('Active Tab:', this.activeTab);
  }
  
  fetchAlbumDetails(releaseID: string): void {
    this.loading = true;
    this.discogsService.getAlbumDetails(releaseID).subscribe({
      next: (data) => {
        this.album = data;
        this.loading = false;
        if (this.album.tracks.length > this.pageSizeTracks) {this.showHeaderFooterTracks = true;}
        // Check if images exist and are valid
        console.log("Album Details:", this.album);
        console.log('Album Artwork:', this.album?.albumArt);
        this.loadPlaylists();
         // Check if images exist and are valid
         if (this.album.albumArt && this.album.albumArt.length > 0) {
          this.isImagesLoaded = true;
        }
      },
      error: (err) => {
        console.error('Error fetching album details:', err);
        this.loading = false;
      }
    });
  }
  sanitizeAndFormatQuery(artist: string, title: string): string {
    const sanitizeString = (str: string) =>
      str
        .replace(/[^\w\s]/gi, '') // Remove non-alphanumeric characters
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '+'); // Replace spaces with '+';
  
    const formattedArtist = sanitizeString(artist);
    const formattedTitle = sanitizeString(title);
    console.log(`${formattedArtist}+${formattedTitle}+playlists+hq`);
    return `${formattedArtist}+${formattedTitle}+playlists+hq`;
  }
  
  loadPlaylists(): void {

    if (!this.album) return;
    this.playListsLoading = true;
    const query = this.sanitizeAndFormatQuery(
      this.album.artist || '',
      this.album.title || ''
    );
    console.log('Page Length for Playlists:', this.pageSizePlaylists);
    this.youTubeService.searchPlaylists(query).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Playlist count:', response.playlists.length);
          if (response.playlists.length > this.pageSizePlaylists){
            this.showHeaderFooterPlaylists = true;
          }
          this.playlists = response.playlists.map((playlist: PlayList) => ({
            title: playlist.title,
            url: playlist.url,
            thumbnail: playlist.thumbnail && playlist.thumbnail.trim() !== '' 
            ? playlist.thumbnail 
            : this.album?.albumArt[0]?.url || 'assets/default-album-art.png' // Use albumArt or default image
          }));
          this.playListsLoading = false; 
        } else {
          console.warn('Failed to fetch playlists.');
        }
      },
      error: (err) => {
        console.error('Error fetching playlists:', err);
        this.playListsLoading = false; 
      },
    });
  }
  downloadPlaylistManually(url: string): void {
    this.loading = true; // Show spinner
    this.statusMessage = 'Downloading...please wait';
    this.messages = []; // Clear previous messages
    this.activeTab = 2; // Navigate to Files tab      
    const payload = { url: url };
    this.youTubeService.downloadPlaylist(url).subscribe({
        next: (response) => {
            console.log('Playlist downloaded:', response);
            this.statusMessage = 'Download complete!';            
            this.files = response.files; // Populate Files tab
            this.loading = false;           
        },
        error: (error) => {
            console.error('Error downloading playlist:', error);
            this.statusMessage = 'Error during download.';
            this.loading = false; // Hide spinner
        },
    });
  }

  viewPlaylist(row: any): void {
    if (row.url) {
      window.open(row.url, '_blank'); // Open the playlist URL in a new tab
    } else {
      console.warn('No URL provided for this playlist.');
    }
  }
  
  downloadPlaylist(row: any): void {
    this.filesLoading = true; // Show spinner
    this.statusMessage = 'Downloading...please wait';
    this.messages = []; // Clear previous messages

    const payload = { url: row.url };
    this.youTubeService.downloadPlaylist(row.url).subscribe({
        next: (response) => {
            console.log('Playlist downloaded:', response);
            this.statusMessage = 'Download complete!';
            
            this.files = response.files; // Populate Files tab

            // Use the FileMapService to map files to album tracks
            if (this.album) {
              const mappedTracks = this.fileMapService.mapFileToTrack(this.album, this.files.map(file => file.title));
              console.log('Mapped Tracks:', mappedTracks);

              // Update the album's track list or a separate dataset if needed
              this.album.tracks = mappedTracks;
            }

            this.filesLoading = false; // Hide spinner
            this.activeTab = 2; // Navigate to Files tab
        },
        error: (error) => {
            console.error('Error downloading playlist:', error);
            this.statusMessage = 'Error during download.';
            this.filesLoading = false; // Hide spinner
        },
    });
}

  assignFileToTrack(file: any): void {
    this.trackFileService.assignFileToTrack(this.album, file);
  }

  updateTrackToFileMapping(): void {
    this.trackFileService.updateTrackToFileMapping(this.album, this.files);
  }

  saveTrackMappings(): void {
    this.trackFileService.saveTrackMappings(this.album);
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

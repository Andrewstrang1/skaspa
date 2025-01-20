import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscogsService } from '../services/discogs.service';
import { Album, AlbumArt, Track, PlayList } from '../models/album.model';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { YouTubeService } from '../services/youTube.service';
import { TrackFileService } from '../services/track-file.service';
import { FileMapService } from '../services/fileMapservice';
import { TrackNumberService } from '../services/track-number.service';
import { TrackInfoService } from '../services/trackInfo.service';
import { TrackDataMappingService } from '../services/track-data-mapping.service';
import { AlbumService } from '../services/album.service';

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
      handler: (row) => this.downloadPlaylistFiles(row),
      location: 'row', // Displays in the hamburger menu
      modal: false, // Doesn't open a modal
      emitOnSave: false, // No save emit needed
    },
  ];
  actionButtonsFiles: ActionButton[] = [
    {
      label: 'Edit',
      iconPath: 'M3 12l18 12-18 12',  // SVG path for edit icon
      handler: (row) => this.editFileTrack(row),
      location: 'row',  // Only in row dropdown
      modal: true,  // Opens modal
      emitOnSave: true
    },
    {
      label: 'Update File Data',
      iconPath: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
      location: 'actionBar', // Displays in the action bar
      handler: (_, selectedRows) => this.saveAlbum(selectedRows),
      requiresSelection: true,
      requiresConfirmation: true  // Ensure confirmation before saving
    }];

  // Variables for tabs
  activeTab: number = 0; // Tracks tab as default
  playlists: PlayList[] = []; // Placeholder for playlists data
  showHeaderFooterTracks: boolean = false;
  showHeaderFooterPlaylists: boolean = false;
  pageSizeTracks: number = 15;
  pageSizePlaylists: number = 8;
  files: any[] = []; // Store files from the downloaded playlist
  trackToFileMapping: { [key: string]: any } = {}; // Map tracks to files
  mappedTracks: any[] = []; // Mapped tracks
  statusMessage: string = '';
  messages: string[] = []; // Array to hold server messages
  selectedYouTubePlaylist: PlayList | null = null;
  fileTableTitle: string = 'Files';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discogsService: DiscogsService,
    private youTubeService: YouTubeService,
    private trackFileService: TrackFileService,
    private fileMapService: FileMapService,
    private trackNumberService: TrackNumberService,
    private trackInfoService: TrackInfoService,
    private trackDataMappingService: TrackDataMappingService,
    private albumService: AlbumService) { }

  ngOnInit(): void {

    this.themeClass = 'purple-theme'; // Example
    this.album = this.albumService.getAlbum();
    console.log('Album loaded from service:', this.album);
    this.fetchAlbumDetailsAlreadyLoaded(this.album);

  }
  onTabChange(index: number): void {
    this.activeTab = index;
  }

  ngOnChanges() {
    console.log('Active Tab:', this.activeTab);
  }

  fetchAlbumDetailsAlreadyLoaded(album: Album): void {
    this.loading = true;
    console.log('Fetching album details for releaseID:', album.releaseID);
    if (album.tracks.length > this.pageSizeTracks) { this.showHeaderFooterTracks = true; }
    this.searchPlaylists();
    this.loading = false;

  }
  fetchAlbumDetails(releaseID: string): void {
    this.loading = true;
    this.discogsService.getAlbumDetails(releaseID).subscribe({
      next: (data) => {
        this.album = data;
        this.loading = false;
        if (this.album.tracks.length > this.pageSizeTracks) { this.showHeaderFooterTracks = true; }
        // Check if images exist and are valid
        console.log("Album Details:", this.album);
        console.log('Album Artwork:', this.album?.albumArt);
        this.searchPlaylists();
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
    console.log(`${formattedArtist}+${formattedTitle}`);
    return `${formattedArtist}-${formattedTitle}`;
  }
  
  async searchPlaylists(): Promise<void> {
    if (!this.album) return;
    this.playListsLoading = true;
    const query = this.sanitizeAndFormatQuery(
      this.album.artist || '',
      this.album.title || ''
    );
    console.log('Getting Playlists for:', query);
    const response = await this.youTubeService.getPlayLists(this.album.artist, this.album.title);
    console.log('Response:', response);
    if (response && response.items) {
      this.playlists = response.items.map((playlist: any) => ({
        // map the data from the above schema to the PlayList interface
        id: playlist.id.playlistId,
        title: playlist.snippet.title,
        url: `https://www.youtube.com/playlist?list=${playlist.id.playlistId}`,
        thumbnail: playlist.snippet.thumbnails.high.url,

      }));
      this.playlists = this.ensureUniquePlaylistTitles(this.playlists);
      this.playListsLoading = false;
      console.log('Playlists:', this.playlists);
      if (this.playlists.length > this.pageSizePlaylists) {
        this.showHeaderFooterPlaylists = true;
      }       
    }
    else {
      console.warn('Failed to fetch playlists.');
      this.playListsLoading = false;
    }
  }

  private ensureUniquePlaylistTitles(playlists: any[]): any[] {
    const titleCount: { [title: string]: number } = {};
    return playlists.map((playlist) => {
      const originalTitle = playlist.title;
      let title = originalTitle;
      if (titleCount[title] > 0) {
        title = `${originalTitle} (${titleCount[title]})`;
      }
      titleCount[originalTitle] = (titleCount[originalTitle] || 0) + 1;
      return { ...playlist, title };
    });
  }

  loadPlaylists(): void {

    if (!this.album) return;
    this.playListsLoading = true;
    const query = this.sanitizeAndFormatQuery(
      this.album.artist || '',
      this.album.title || ''
    );

    this.youTubeService.searchPlaylists(query).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Playlist count:', response.data.length);
          if (response.data.length > this.pageSizePlaylists) {
            this.showHeaderFooterPlaylists = true;
          }
          this.playlists = response.data.map((playlist: PlayList) => ({
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
    this.youTubeService.downloadPlaylist(url, '').subscribe({
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

  downloadPlaylistFiles(row: PlayList): void {
    this.filesLoading = true; // Show spinner
    this.statusMessage = 'Downloading...please wait';
    this.messages = []; // Clear previous messages
    this.selectedYouTubePlaylist = row;
    this.fileTableTitle = 'Playslist: ' + row.title;
    const payload = { url: row.url };
    this.youTubeService.downloadPlaylist(row.url, row.title).subscribe({
      next: (response) => {
        console.log('Playlist downloaded:', response);
        this.statusMessage = 'Download complete!';

        this.files = response.files; // Populate Files tab
        console.table(this.files);

        // Use the FileMapService to map files to album tracks
        if (this.album) {

          // handle the fact that file.title might be set to "Unknown Title and use the filepath instead
          this.files.forEach(file => {
            console.log('file.title:', file.title);
            if (file.title === 'Unknown Title') {
              file.title = file.filePath;
              console.log('New file.title:', file.title);
            }
          });

          this.mappedTracks = this.fileMapService.mapFileToTrack(this.album, this.files.map(file => file.title));
          console.log('Mapped Tracks:', this.mappedTracks);
          const trackMap = this.trackNumberService.createTrackMap(this.mappedTracks.map((t: any) => t.trackNumber));
          this.mappedTracks.forEach((track: any) => {
            track.trackNumber = trackMap[track.trackNumber];
          });
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
    console.table(this.files);
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
  editFileTrack(track: any) {
    console.log('Edit file track:', track);

    // 


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
  saveAlbum(tracks: any[] | undefined): void {
    if (!this.album) {
      console.error('No album data available.');
      return;
    }
    const mappedResponse: any[] = [];
    // fetch album metadata
    this.trackInfoService.getAlbumData(this.album.artist, this.album.title).subscribe({
      next: (response) => {
        console.log('Album Metadata:', response);
        //map the response to something nicer
        const mappedResponse = this.trackDataMappingService.mapToTracks(response);
        console.log('Mapped Response:', mappedResponse);
      },
      error: (error) => {
        console.error('Error fetching album metadata:', error);
      },
    })

    if (tracks) {

      tracks.forEach((track: any) => {
        this.trackInfoService.getTrackInfo(track.title, track.artist).subscribe({
          next: (response) => {
            const bestRelease = this.trackInfoService.getBestRelease(response, this.album?.title || '');
            if (bestRelease) {
              console.log(`Best release for track "${track.title}":`, bestRelease);
              track.recording = bestRelease.recording;
              track.release = bestRelease.release;

              // Fetch contributors using recording ID
              const recordingId = bestRelease.recording.id;
              this.trackInfoService.getContributors(recordingId).subscribe({
                next: (contributorResponse) => {
                  console.log(`Contributors for track "${track.title}":`, contributorResponse);
                  track.contributors = this.extractContributors(contributorResponse);
                },
                error: (error) => {
                  console.error(`Error fetching contributors for "${track.title}":`, error);
                },
              });
            } else {
              console.warn(`No suitable release found for track "${track.title}"`);
            }
          },
          error: (error) => {
            console.error(`Error fetching track info for "${track.title}":`, error);
          },
        });
      });
    }

    this.album.tracks = tracks as Track[];

    // Prepare the payload
    const imageElement = document.querySelector('img[alt="Album cover"]') as HTMLImageElement;
    const payload = this.fileMapService.preparePayload(this.album, imageElement);
    payload.then((data) => {
      console.log('Payload data:', data);
    });
  }

  private extractContributors(response: any): { performers: string[]; producers: string[]; composers: string[] } {
    const performers: string[] = [];
    const producers: string[] = [];
    const composers: string[] = [];

    const relations = response.relations || [];

    relations.forEach((relation: any) => {
      const type = relation.type;
      const name = relation.artist?.name || relation.target || 'Unknown';

      if (type === 'instrument' && relation.attributes) {
        // Performer with instrument
        performers.push(`${name}: ${relation.attributes.join(', ')}`);
      } else if (type === 'performer') {
        performers.push(name);
      } else if (type === 'producer') {
        producers.push(name);
      } else if (type === 'composer') {
        composers.push(name);
      }
    });

    return { performers, producers, composers };
  }



}

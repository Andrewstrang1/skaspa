import { Component, OnInit } from '@angular/core';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { ApiConfig, apiConfig } from '../../services/api-config'; // Adjust path as needed
import { ApiService } from '../../services/api-services.service';
import { Router } from '@angular/router';

export interface AlbumTableRow {
 AlbumID: number;
 AlbumTitle: string;
 artist: string;
 YearOfRelease: string;
 selected?: boolean;
 rating: number;
}

@Component({
  selector: 'app-api-integration',
  templateUrl: './api-integration.component.html',
  styleUrls: ['./api-integration.component.css']
})
export class ApiIntegrationComponent implements OnInit {
  apiConfig: ApiConfig;
  apiData: any;

  tableData: AlbumTableRow[] = [];
  displayedColumns = ['AlbumID','artist', 'AlbumTitle', 'YearOfRelease'];
  constructor(private apiService: ApiService, private router: Router) {
    // Load the configuration for the specific API
    this.apiConfig = apiConfig.find(api => api.name === 'AlbumsAPI')!;
  }
  selectable = true; // Enable checkbox column
  showHamburgerMenu = true;
  showRating = true;
  actionButtons: ActionButton[] = [
    {
      label: 'Edit',
      iconPath: 'M3 12l18 12-18 12',  // SVG path for edit icon
      handler: (row) => this.editRow(row),
      location: 'row',  // Only in row dropdown
      modal: true,  // Opens modal
      emitOnSave: true
    },
    {
      label: 'View Album',
      iconPath: 'M12 2C8.13 2 5 5.13 5 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zM4 9c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9zm6 6.5L8.5 15l3.5 3.5 7-7L14 9l-4 4.5z',
      handler: (row) => this.viewalbum(row),
      location: 'row'
      }
    ];

  ngOnInit(): void {
    this.apiService.setConfig('AlbumsAPI');
    this.apiService.get().subscribe(
      data => {
        this.apiData = data;
        this.tableData = this.apiData;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Edit single row from the row dropdown
  editRow(row: AlbumTableRow) {
    console.log('Edit row:', row);
  }

  handleSave(updatedRow: AlbumTableRow): void {
    this.apiService.setConfig('AlbumsAPI');
    this.apiService.put(updatedRow.AlbumID, updatedRow).subscribe(
      response => {
        console.log('album updated successfully:', response);
      },
      error => {
        console.error('Error updating album:', error);
      }
    );
  }

    // Add to favorites for selected rows or a single row
    addToFavourites(rows: AlbumTableRow | AlbumTableRow[]) {
      const rowsToUpdate = Array.isArray(rows) ? rows : [rows];
      //rowsToUpdate.forEach(row => row.status = 'Favorite');
      console.log('Adding to favorites:', rowsToUpdate);
    }
    viewalbum(row: AlbumTableRow) {
      console.log("album Row: ", row.AlbumID);
      if (row && row.AlbumID) {
        // Adjust for lazy-loaded path if necessary
         this.router.navigateByUrl(`feature/album-details/${row.AlbumID}`); // Absolute path with prefix if needed
      } else {
        console.error("album ID is missing, cannot navigate to album details.");
      }
    }
    
}

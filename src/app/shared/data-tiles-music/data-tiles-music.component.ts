import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Album } from '../../music/models/album.model';

export interface ActionButton {
  label: string;
  iconPath: string;
  handler: (row?: any, selectedRows?: any[]) => void;
  location: 'row' | 'actionBar' | 'both';
  modal?: boolean;
  emitOnSave?: boolean;
  requiresSelection?: boolean;
  requiresConfirmation?: boolean;  // New property for delete confirmation
}

@Component({
  selector: 'app-data-tiles-music',
  templateUrl: './data-tiles-music.component.html',
  styleUrls: ['../shared-styles/data-table-h.component.css', '../shared-styles/data-table-h-purple-theme.css', 
    '../shared-styles/data-table-h-green-theme.css', '../shared-styles/data-table-h-blue-theme.css'
  ],
})
export class DataTilesMusicComponent implements OnChanges {
  @Input() data: Album[] = [];
  @Input() themeClass: string = '';
  @Input() showRating: boolean = false;
  @Input() selectable: boolean = false;
  @Input() tableTitle: string = '';
  @Input() pageSizeOptions: number[] = [5, 10, 20];

  @Output() viewDetails = new EventEmitter<any>();

  filteredData: Album[] = [];
  pagedData: Album[] = [];
  selectedRows: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';
  loading: boolean = false;

  ngOnChanges(): void {
    this.filteredData = [...this.data];
    this.updatePagedData();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchInputChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    this.filteredData = this.data.filter(
      (album) =>
        album.title.toLowerCase().includes(term) ||
        album.artist.toLowerCase().includes(term) ||
        album.catalogNumber.toLowerCase().includes(term)
    );
    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedData();
    }
  }

  goToPage(event: Event): void {
    const selectedPage = +(event.target as HTMLSelectElement).value;
    if (!isNaN(selectedPage) && selectedPage >= 1 && selectedPage <= this.totalPages) {
      this.changePage(selectedPage);
    }
  }

  changePageSize(event: Event): void {
    const newSize = +(event.target as HTMLSelectElement).value;
    if (!isNaN(newSize) && newSize > 0) {
      this.pageSize = newSize;
      this.currentPage = 1; // Reset to the first page on page size change
      this.updatePagedData();
    }
  }

  toggleRowSelection(album: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedRows.push(album);
    } else {
      this.selectedRows = this.selectedRows.filter((selected) => selected !== album);
    }
  }

  viewAlbumDetails(album: any): void {
    this.viewDetails.emit(album);
  }

  hasSelectedRows(): boolean {
    return this.selectedRows.length > 0;
  }  
}

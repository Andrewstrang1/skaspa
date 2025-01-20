import { Component, Input, Output, EventEmitter, OnChanges, Renderer2  } from '@angular/core';

export interface ActionButton {
  label: string;
  iconPath: string;
  handler: (row?: any, selectedRows?: any[]) => void;
  location: 'row' | 'actionBar' | 'tile' | 'both' | 'image';
  modal?: boolean;
  emitOnSave?: boolean;
  requiresSelection?: boolean;
  requiresConfirmation?: boolean;  // New property for delete confirmation
}

@Component({
  selector: 'app-data-table-h',
  templateUrl: './data-table-h.component.html',
  styleUrls: ['../shared-styles/data-table-h.component.css', '../shared-styles/data-table-h-purple-theme.css', 
    '../shared-styles/data-table-h-green-theme.css', '../shared-styles/data-table-h-blue-theme.css'
  ], 
})
export class DataTableHComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() selectable: boolean = false;
  @Input() actionButtons: ActionButton[] = [];
  @Input() showHamburgerMenu: boolean = false;
  @Input() uniqueKey: string = 'id'; // Default to 'id'
  @Input() tableTitle: string = ''; 
  @Input() showRating: boolean = false;
  @Input() showTiles: boolean = false;
  @Input() themeClass: string = '';
  @Input() pageLength: number = 10; // Default page length
  @Input() currentPage: number = 1; // Track the current page
  @Input() pageSize: number = 15; // Default number of rows per page
  @Input() showHeaderFooter: boolean = true;
  @Input() actionBarVisible: boolean = false; // New property for action bar visibility, default to false;
  @Input() showIcon: boolean = false; // Show icon column
  @Input() showThumbnail: boolean = false; // Show thumbnail column
  
  @Output() save = new EventEmitter<any>();  // Emit saved data to feature component
  @Output() edit = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {}

  pagedData: any[] = [];
  pageSizeOptions = [5, 10, 15, 25, 50, 100];
  selectAllChecked = false;
  openDropdownRowId: number | null = null;
  confirmingAction: { button: ActionButton; row: any } | null = null; // For confirmation modal
  editingRow: any = null; // Tracks the row being edited
  selectedRows: any[] = []; // Stores selected rows
  searchTerm: string = ''; // Property to hold the search term
  filteredData: any[] = []; // Array to hold the filtered data
  loading: boolean = false; // New loading state property
  

  // Sorting state
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  ngOnChanges() {
    this.setLoading(true); // Start loading when data changes
    this.updatePagedData();
    this.setLoading(false); // Stop loading once data is updated    
  }

  // Handle action with optional confirmation
  triggerAction(button: ActionButton, row?: any) {
    if (button.requiresConfirmation) {
      this.confirmingAction = { button, row }; // Set up the confirmation modal
      console.log('Confirmation Required:', this.confirmingAction);
    } else if (button.modal) {
      this.openDropdownRowId = null;
      this.editingRow = row; // Open modal for edit
    } else {
      button.handler(row, this.selectedRows); // Directly execute action
      this.openDropdownRowId = null;
      this.clearSelection(); // Clear selection after action only if no modal or confirmation
    }
  }

  setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  // Confirm and execute the action
  confirmAction() {
    if (this.confirmingAction) {
      const { button, row } = this.confirmingAction;
      button.handler(row, this.selectedRows); // Execute the action after confirmation
      this.clearSelection(); // Clear selected rows after confirmed action
      this.confirmingAction = null; // Reset the confirmation action
    }
  } 

  // Clear selected rows and update display
  clearSelection() {
    this.selectedRows = []; // Reset selected rows
    this.selectAllChecked = false; // Reset select-all checkbox
    this.updatePagedData(); // Refresh paged data display
  }
  
  closeModal() {
    this.editingRow = null;
    this.confirmingAction = null; // Close confirmation modal if open
  }  

  get totalPages(): number {
    const sourceData = this.searchTerm ? this.filteredData : this.data;
    return Math.ceil(sourceData.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Update paged data method to consider the filtered data
  updatePagedData(): void {
    const sourceData = this.searchTerm ? this.filteredData : this.data; // Use filtered data if a search term exists
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedData = sourceData.slice(startIndex, startIndex + this.pageSize);
    this.selectAllChecked = this.pagedData.every(row => this.selectedRows.includes(row));

  }

  hasSelectedRows(): boolean {
    return this.selectedRows.length > 0;
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagedData();
  }

  changePageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newSize = Number(target.value);
    if (!isNaN(newSize)) {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.updatePagedData();
    }
  }

  goToPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedPage = Number(target.value);
    if (!isNaN(selectedPage) && selectedPage >= 1 && selectedPage <= this.totalPages) {
      this.changePage(selectedPage);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAllChecked = checked;
    if (checked) {
      this.selectedRows = [...this.pagedData];
    } else {
      this.clearSelection(); // Clear all selections
    }
  }
  
  toggleRowSelection(row: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row);
    }
    this.selectAllChecked = this.pagedData.every(row => this.selectedRows.includes(row));
  }

  // Sorting logic
  sortColumn(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? '' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.sortDirection === '') {
      this.updatePagedData();
    } else {
      this.data.sort((a, b) => {
        if (a[column] < b[column]) return this.sortDirection === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      this.updatePagedData();
    }
  }

  toggleDropdown(row: any) {
    const rowId = row[this.uniqueKey];
    this.openDropdownRowId = this.openDropdownRowId === rowId ? null : rowId;
    console.log('Toggled row ID:', this.openDropdownRowId);
  }
  
  

  // Open the edit modal and set the row to be edited
  openEditModal(row: any) {
    this.editingRow = { ...row };  // Clone row data to edit
    this.openDropdownRowId = null;  // Close dropdown
  }

  // Save data from modal and emit to feature if emitOnSave is set
  saveData(updatedRow: any) {
    if (this.editingRow) {
      const index = this.data.findIndex(row => row.id === updatedRow.id);
      if (index > -1) {
        this.data[index] = { ...updatedRow };
        this.updatePagedData();
        this.save.emit(updatedRow); // Emit updated row data if needed
      }
    }
    this.editingRow = null; // Close modal
  }  


  // Method to handle input changes in the search box
  onSearchInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.filterData();
  }
  
  // Method to filter the data based on the search term
  filterData(): void {
    if (this.searchTerm) {
      this.filteredData = this.data.filter(row => {
        return this.displayedColumns.some(column => {
          return String(row[column])
            .toLowerCase()
            .includes(this.searchTerm);
        });
      });
    } else {
      // If no search term, reset filteredData to the original data
      this.filteredData = [...this.data];
    }
    this.updatePagedData(); // Call the updated method to reapply page limits
  }

  // Determine the star class based on rating and star position
  getStarClass(rating: number, starPosition: number): 'full' | 'half' | 'empty' {
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    if (starPosition <= roundedRating) {
      return 'full';
    } else if (starPosition - 0.5 === roundedRating) {
      return 'half';
    } else {
      return 'empty';
    }
  }

  // Helper method to get an array of full, half, and empty stars based on the rating
  getStarArray(rating: number): number[] {
    const roundedRating = Math.min(Math.round(rating * 2) / 2, 5);
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (roundedRating >= i) {
        stars.push(1); // Full star
      } else if (roundedRating >= i - 0.5) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
  
    return stars;
  }  
}
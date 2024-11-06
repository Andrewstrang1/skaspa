import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

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
  selector: 'app-data-table-h',
  templateUrl: './data-table-h.component.html',
  styleUrls: ['./data-table-h.component.css']
})
export class DataTableHComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() selectable: boolean = false;
  @Input() actionButtons: ActionButton[] = [];
  @Input() showHamburgerMenu: boolean = false;

  @Output() save = new EventEmitter<any>();  // Emit saved data to feature component
  @Output() edit = new EventEmitter<any>();

  pagedData: any[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 1;
  selectAllChecked = false;
  openDropdownRowId: number | null = null;
  confirmingAction: { button: ActionButton; row: any } | null = null; // For confirmation modal
  editingRow: any = null; // Tracks the row being edited
  selectedRows: any[] = []; // Stores selected rows
  

  // Sorting state
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  ngOnChanges() {
    this.updatePagedData();
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
      this.clearSelection(); // Clear selection after action only if no modal or confirmation
    }
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
    return Math.ceil(this.data.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.data.slice(startIndex, startIndex + this.pageSize);
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

  toggleDropdown(rowId: number) {
    this.openDropdownRowId = this.openDropdownRowId === rowId ? null : rowId;
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


}

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-data-table-h',
  templateUrl: './data-table-h.component.html',
  styleUrls: ['./data-table-h.component.css']
})
export class DataTableHComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() showActions: boolean = false;
  @Input() selectable: boolean = false;
  @Input() actionButtons: { label: string; handler: () => void }[] = [];

  @Output() delete = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  pagedData: any[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 1;
  editingRow: any = null;
  selectedRows: any[] = []; // Track selected rows
  selectAllChecked = false; // Track select all checkbox state

  ngOnChanges() {
    this.updatePagedData();
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  updatePagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.data.slice(startIndex, startIndex + this.pageSize);

    // Check if all rows in the current page are selected
    this.selectAllChecked = this.pagedData.every(row => this.selectedRows.includes(row));
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

  // Select or Deselect All Rows in the Current Page
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAllChecked = checked;

    if (checked) {
      // Select all rows in the current page that are not already in selectedRows
      this.pagedData.forEach(row => {
        if (!this.selectedRows.includes(row)) {
          this.selectedRows.push(row);
        }
      });
    } else {
      // Deselect all rows in the current page from selectedRows
      this.pagedData.forEach(row => {
        this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row);
      });
    }
  }

  // Select or Deselect Individual Rows
  toggleRowSelection(row: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row);
    }

    // Update "Select All" checkbox state based on individual row selections in the current page
    this.selectAllChecked = this.pagedData.every(row => this.selectedRows.includes(row));
  }

  editRow(row: any) {
    this.editingRow = { ...row };
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  saveRow(updatedRow: any) {
    const index = this.data.findIndex(item => item.id === updatedRow.id);
    if (index > -1) {
      this.data[index] = { ...updatedRow };
      this.updatePagedData();
      this.save.emit(updatedRow);
    }
    this.closeModal();
  }

  closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.editingRow = null;
  }

  deleteRow(row: any) {
    this.data = this.data.filter(item => item.id !== row.id);
    this.updatePagedData();
    this.delete.emit(row);
  }
}

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-data-table-h',
  templateUrl: './data-table-h.component.html',
  styleUrls: ['./data-table-h.component.css']
})
export class DataTableHComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() selectable: boolean = false;
  @Input() actionButtons: { label: string; path: string; handler: (selectedRows: any[]) => void }[] = [];

  @Output() delete = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  pagedData: any[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 1;
  selectedRows: any[] = [];
  selectAllChecked = false;

  ngOnChanges() {
    this.updatePagedData();
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
    console.log("Selected rows:", this.selectedRows); // Debugging line
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
      this.pagedData.forEach(row => {
        if (!this.selectedRows.includes(row)) {
          this.selectedRows.push(row);
        }
      });
    } else {
      this.pagedData.forEach(row => {
        this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row);
      });
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

  triggerAction(handler: (selectedRows: any[]) => void) {
    handler(this.selectedRows);
  }
}

import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements AfterViewInit, OnChanges {
  @Input() data: any[] = []; // Full data passed from parent component
  @Input() displayedColumns: string[] = []; // Columns to display
  @Input() showActions: boolean = false; // Toggle action buttons visibility
  @Input() statusIcons: boolean = false; // Toggle status icons visibility
  @Input() onSave: (updatedRow: any) => void = () => {}; // Save callback function

  @Output() delete = new EventEmitter<any>(); // Event emitter for delete action

  dataSource = new MatTableDataSource<any>(); // MatTableDataSource for pagination and sorting
  pageSizeOptions = [5, 10, 20]; // Options for rows per page
  pageSize = 10; // Default page size

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    console.log("Displayed Columns in DataTableComponent (ngAfterViewInit):", this.displayedColumns);

    this.dataSource.paginator = this.paginator; // Bind paginator to dataSource
  }

  ngOnChanges() {
    console.log("Data received in DataTableComponent:", this.data);
    console.log("Displayed Columns received in DataTableComponent:", this.displayedColumns);
    this.updateDataSource();
  }
  

  // Updates the dataSource based on the current data and paginator settings
  updateDataSource() {
    this.dataSource.data = this.data;
    if (this.paginator) {
      this.paginator.length = this.data.length; // Update paginator length to total items
      this.paginator.pageIndex = 0; // Reset to first page
    }
  }

  // Handles page change events to update paged data
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Opens the edit dialog with the selected row data
  editRow(row: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { row, columns: this.displayedColumns }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSave(result); // Calls onSave callback with updated row data
      }
    });
  }

  // Emits delete event for the selected row
  deleteRow(row: any) {
    this.delete.emit(row);
  }
}

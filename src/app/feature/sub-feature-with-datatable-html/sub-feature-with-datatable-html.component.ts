import { Component, OnInit } from '@angular/core';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';

interface TableRow {
  id: number;
  name: string;
  status: string;
  selected?: boolean;
}

@Component({
  selector: 'app-sub-feature-with-datatable-html',
  templateUrl: './sub-feature-with-datatable-html.component.html',
  styleUrls: ['./sub-feature-with-datatable-html.component.css']
})
export class SubFeatureWithDatatableComponentHTML implements OnInit {
  tableData: TableRow[] = Array.from({ length: 1000}, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: ['Active', 'Pending', 'Inactive'][i % 3],
    selected: false
  }));

  displayedColumns = ['id', 'name', 'status'];
  selectable = true; // Enable checkbox column
  showHamburgerMenu = true; // Show row dropdown menu for actions

  // Define action buttons with custom icons and handlers
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
      label: 'Delete Selected',
      iconPath: 'M3 6h18v2H3V6zM3 10h18v10H3V10z',
      handler: (_, selectedRows) => this.deleteSelectedRows(selectedRows),
      location: 'actionBar',
      requiresSelection: true,
      requiresConfirmation: true  // Ensure confirmation before delete
    },
    {
      label: 'Add to Favourites',
      iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      handler: (row, selectedRows) => this.addToFavourites(row || selectedRows),
      location: 'both', // Appears in both row dropdown and action bar
    }
  ];

  ngOnInit(): void { }

  // Edit single row from the row dropdown
  editRow(row: TableRow) {
    console.log('Edit row:', row);
  }

  // Delete selected rows from the action bar
  deleteSelectedRows(selectedRows: TableRow[] | undefined) {
    const rowsToDelete = selectedRows ?? [];
    console.log('Deleting selected rows:', rowsToDelete);
    this.tableData = this.tableData.filter(row => !rowsToDelete.includes(row));
  }
  

  // Add to favorites for selected rows or a single row
  addToFavourites(rows: TableRow | TableRow[]) {
    const rowsToUpdate = Array.isArray(rows) ? rows : [rows];
    rowsToUpdate.forEach(row => row.status = 'Favorite');
    console.log('Adding to favorites:', rowsToUpdate);
  }

  handleSave(updatedRow: TableRow) {
    console.log('Feature component received updated row:', updatedRow);
    const index = this.tableData.findIndex(row => row.id === updatedRow.id);
    if (index > -1) {
      this.tableData[index] = { ...updatedRow };
    }
  }
}

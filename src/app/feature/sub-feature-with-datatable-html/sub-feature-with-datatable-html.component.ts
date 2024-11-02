import { Component, OnInit } from '@angular/core';


// Create an interface for the table datastructure
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
  tableData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: ['Active', 'Pending', 'Inactive'][i % 3],
    selected: false
  }));

  displayedColumns = ['id', 'name', 'status'];
  selectable = true; // Enable checkbox column
  
  
  // Action buttons
  actionButtons = [
    {
      label: 'Delete Selected',
      path: 'M3 6l3 12c.2 1 1.8 2 2 2h8c1 0 1.8-1 2-2l3-12H3zm10.5 3l-.8 9h-2l-.7-9h3.5zM20 4h-5l-1-1H9L8 4H3v2h18V4z',
      handler: (selectedRows: any[]) => this.deleteSelected(selectedRows)
    },
    {
      label: 'Add to Favourites',
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      handler: (selectedRows: any[]) => this.addToFavourites(selectedRows)
    }
  ];

  ngOnInit(): void { }

  handleSave(updatedRow: any) {
    console.log('Row edited:', updatedRow);
  }

  handleDelete(deletedRow: any) {
    console.log('Row deleted:', deletedRow);
  }

  deleteSelected(selectedRows: any[]) {
    console.log('Deleting selected rows:', selectedRows);
    // Perform delete action
  }

  editSelected() {
    console.log('Edit selected rows:', this.tableData.filter(row => row.selected));
  }

  addToFavourites(selectedRows: any[]) {
    console.log('Adding to favourites:', selectedRows);
    // Perform add to favourites action
  }
}

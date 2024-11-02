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
  actionButtons = [
    {
      label: 'Delete Selected',
      handler: () => this.deleteSelected()
    }
    // Add more buttons as needed
  ];

  ngOnInit(): void {}

  handleSave(updatedRow: any) {
    console.log('Row edited:', updatedRow);
  }

  handleDelete(deletedRow: any) {
    console.log('Row deleted:', deletedRow);
  }

  deleteSelected() {
    console.log('Delete selected rows:', this.tableData.filter(row => row.selected));
  }
}

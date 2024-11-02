import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-feature-with-datatable',
  templateUrl: './sub-feature-with-datatable.component.html',
  styleUrls: ['./sub-feature-with-datatable.component.css']
})
export class SubFeatureWithDatatableComponent implements OnInit {
  tableData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: ['red', 'amber', 'green'][i % 3]
  }));

  displayedColumns = ['id', 'name', 'status']; // Initialize with column names

  ngOnInit(): void {
    console.log("Displayed Columns in SubFeatureWithDatatableComponent:", this.displayedColumns); // Confirm displayedColumns is initialized
    console.log("Table Data:", this.tableData);
  }
}

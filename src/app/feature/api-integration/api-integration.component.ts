import { Component, OnInit } from '@angular/core';
import { ActionButton } from '../../shared/data-table-h/data-table-h.component';
import { ApiConfig, apiConfig } from '../../services/api-config'; // Adjust path as needed
import { ApiServicesService } from '../../services/api-services.service';
import { Router } from '@angular/router';

export interface ProductTableRow {
  ProductID: number;
  ProductName: string;
  SupplierID: number;
  CategoryID: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  UnitsOnOrder: number;
  ReorderLevel: number;
  Discontinued: boolean;
}

@Component({
  selector: 'app-api-integration',
  templateUrl: './api-integration.component.html',
  styleUrls: ['./api-integration.component.css']
})
export class ApiIntegrationComponent implements OnInit {
  apiConfig: ApiConfig;
  apiData: any;

  tableData: ProductTableRow[] = [];
  displayedColumns = ['ProductID', 'ProductName', 'UnitPrice', 'QuantityPerUnit', 'UnitsInStock', 'UnitsOnOrder', 'ReorderLevel', 'Discontinued'];
  constructor(private apiService: ApiServicesService, private router: Router) {
    // Load the configuration for the specific API
    this.apiConfig = apiConfig.find(api => api.name === 'ProductsAPI')!;
  }
  selectable = false; // Enable checkbox column
  showHamburgerMenu = true;
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
      label: 'View Product',
      iconPath: 'M12 2C8.13 2 5 5.13 5 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zM4 9c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9zm6 6.5L8.5 15l3.5 3.5 7-7L14 9l-4 4.5z',
      handler: (row) => this.viewProduct(row),
      location: 'row'
      }
    ];

  ngOnInit(): void {
    this.apiService.get('http://localhost:3000', 'api/products/all').subscribe(
      (data: ProductTableRow[]) => {
        this.tableData = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Edit single row from the row dropdown
  editRow(row: ProductTableRow) {
    console.log('Edit row:', row);
  }

  handleSave(updatedRow: ProductTableRow): void {
    this.apiService.put('http://localhost:3000', `api/products/${updatedRow.ProductID}`, updatedRow).subscribe(
      response => {
        console.log('Product updated successfully:', response);
      },
      error => {
        console.error('Error updating product:', error);
      }
    );
  }

    // Add to favorites for selected rows or a single row
    addToFavourites(rows: ProductTableRow | ProductTableRow[]) {
      const rowsToUpdate = Array.isArray(rows) ? rows : [rows];
      //rowsToUpdate.forEach(row => row.status = 'Favorite');
      console.log('Adding to favorites:', rowsToUpdate);
    }
    viewProduct(row: ProductTableRow) {
      console.log("Product Row: ", row.ProductID);
      if (row && row.ProductID) {
        // Adjust for lazy-loaded path if necessary
         this.router.navigateByUrl(`feature/product-details/${row.ProductID}`); // Absolute path with prefix if needed
      } else {
        console.error("Product ID is missing, cannot navigate to product details.");
      }
    }
    
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Components with Angular Material
import { DataTableComponent } from './data-table/data-table.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

// Non-Material Components
import { DataTableHComponent } from './data-table-h/data-table-h.component';
import { EditComponentHComponent } from './edit-component-h/edit-component-h.component';

@NgModule({
  declarations: [
    DataTableComponent,       // Material component
    EditDialogComponent,      // Material component
    DataTableHComponent,      // Non-Material component
    EditComponentHComponent   // Non-Material component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
    // Angular Material Modules for Material Components
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    DataTableComponent,       // Material component
    EditDialogComponent,      // Material component
    DataTableHComponent,      // Non-Material component
    EditComponentHComponent   // Non-Material component
  ],
  entryComponents: [EditDialogComponent]  // Required for Angular Material dialog
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components with Angular Material
import { DataTableComponent } from './data-table/data-table.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

// Non-Material Components
import { DataTableHComponent } from './data-table-h/data-table-h.component';
import { DraggableDataTableComponent } from './draggable-data-table/draggable-data-table.component';
import { EditComponentHComponent } from './edit-component-h/edit-component-h.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

// Pipes and services

import { SplitCamelCasePipe } from '../pipes/splitCamelCase.pipe';
import { CarouselComponent } from './carousel/carousel.component';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavigationDropdownComponent } from './navigation-dropdown/navigation-dropdown.component';




@NgModule({
  declarations: [
    DataTableComponent,       // Material component
    EditDialogComponent,      // Material component
    DataTableHComponent,      // Non-Material component
    EditComponentHComponent, StarRatingComponent,
    SplitCamelCasePipe,
    CarouselComponent,
    DraggableDataTableComponent,
    ToggleSwitchComponent,
    SpinnerComponent,
    NavigationDropdownComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    
    // Angular Material Modules for Material Components
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule,
    NgbModule, NgbCarouselModule
  ],
  exports: [
    DataTableComponent,       // Material component
    EditDialogComponent,      // Material component
    DataTableHComponent,      // Non-Material component
    EditComponentHComponent,   // Non-Material component
    DraggableDataTableComponent,
    StarRatingComponent,
    SplitCamelCasePipe,
    CarouselComponent,
    ToggleSwitchComponent, 
    SpinnerComponent, 
    NavigationDropdownComponent
    
  ],
  entryComponents: [EditDialogComponent]  // Required for Angular Material dialog
})
export class SharedModule {}

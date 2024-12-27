import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-draggable-data-table',
  templateUrl: './draggable-data-table.component.html',
  styleUrls: [
    './draggable-data-table.component.css',
    '../shared-styles/data-table-h-purple-theme.css',
    '../shared-styles/data-table-h-green-theme.css',
    '../shared-styles/data-table-h-blue-theme.css',
  ],
})
export class DraggableDataTableComponent implements OnInit {
  @Input() sourceData: any[] = []; // Input for source table data
  @Input() destinationData: any[] = []; // Input for destination table data
  @Input() displayedColumns: string[] = []; // Common columns for both tables
  @Input() themeClass: string = 'purple-theme'; // Theme class
  @Input() tableSizeRatios: string = '50% 50%'; // Width ratios for tables

  @Output() saveChanges = new EventEmitter<any[]>(); // Emit updated destination data
  @Output() resetData = new EventEmitter<void>(); // Emit reset action

  originalSourceData: any[] = [];
  originalDestinationData: any[] = [];

  ngOnInit(): void {
    this.originalSourceData = JSON.parse(JSON.stringify(this.sourceData));
    this.originalDestinationData = JSON.parse(JSON.stringify(this.destinationData));
  }

  onDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      // If the item is dropped in the same container, reorder items
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // If the item is dropped in a different container, transfer the item
      transferArrayItem(
        event.previousContainer.data, // From this container
        event.container.data, // To this container
        event.previousIndex, // Index of the item in the previous container
        event.currentIndex // Index to insert in the new container
      );
    }
  }
  

  onSave(): void {
    this.saveChanges.emit(this.destinationData);
  }

  onUndo(): void {
    this.sourceData = JSON.parse(JSON.stringify(this.originalSourceData));
    this.destinationData = JSON.parse(JSON.stringify(this.originalDestinationData));
    this.resetData.emit();
  }
}

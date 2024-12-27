import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-feature-with-draggable-table',
  templateUrl: './sub-feature-with-draggable-table.component.html',
  styleUrls: ['./sub-feature-with-draggable-table.component.css']
})
export class SubFeatureWithDraggableTableComponent  {

  sourceData = [
    { id: 1, name: 'Track A1', artist: 'Artist A', duration: '3:45' },
    { id: 2, name: 'Track A2', artist: 'Artist B', duration: '4:15' },
    { id: 3, name: 'Track A3', artist: 'Artist C', duration: '5:00' },
    { id: 4, name: 'Track A4', artist: 'Artist D', duration: '2:30' },
    { id: 5, name: 'Track A5', artist: 'Artist E', duration: '4:00' },
  ];

  destinationData = [
    { id: 1, name: 'Track B1', artist: 'Artist F', duration: '3:50' },
    { id: 2, name: 'Track B2', artist: 'Artist G', duration: '4:20' },
    { id: 3, name: 'Track B3', artist: 'Artist H', duration: '3:10' },
    { id: 4, name: 'Track B4', artist: 'Artist I', duration: '4:50' },
    { id: 50, name: 'Track B5', artist: 'Artist J', duration: '2:45' },
  ];

  handleSave(updatedData: any[]): void {
    console.log('Updated Destination Data:', updatedData);
  }

  handleReset(): void {
    console.log('Data has been reset.');
  }

}




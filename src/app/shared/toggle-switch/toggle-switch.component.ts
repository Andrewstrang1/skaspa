import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.css'],
})
export class ToggleSwitchComponent {
  @Input() isChecked: boolean = false; // Input to pass the initial state
  @Input() label: string = ''; // Optional label for the toggle switch
  @Output() toggleChange = new EventEmitter<boolean>(); // Output to emit state changes

  onToggleChange(): void {
    this.isChecked = !this.isChecked;
    this.toggleChange.emit(this.isChecked); // Emit the new value to the parent
  }
}

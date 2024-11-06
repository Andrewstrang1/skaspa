import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-component-h',
  templateUrl: './edit-component-h.component.html',
  styleUrls: ['./edit-component-h.component.css']
})
export class EditComponentHComponent implements OnChanges {
  @Input() rowData: any = {}; // Data to edit
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    console.log('EditComponentH - Initial rowData for editing:', this.rowData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowData'] && this.rowData) {
      console.log('EditComponentH - rowData changed:', this.rowData);
      this.initializeForm();
    }
  }

  // Initialize the form with the current rowData
  initializeForm() {
    this.form = this.fb.group({});
    for (let key in this.rowData) {
      this.form.addControl(key, this.fb.control(this.rowData[key]));
    }
  }

  onSave() {
    const updatedData = this.form.value; // Capture updated values from the form
    console.log('EditComponentH - Emitting updated data:', updatedData);
    this.save.emit(updatedData); // Emit the updated data instead of rowData
  }

  onCancel() {
    console.log('EditComponentH - Canceling edit');
    this.cancel.emit();
  }
}

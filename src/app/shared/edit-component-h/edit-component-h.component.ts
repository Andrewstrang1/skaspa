import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-component-h',
  templateUrl: './edit-component-h.component.html',
  styleUrls: ['./edit-component-h.component.css']
})
export class EditComponentHComponent {
  @Input() rowData: any = {}; // Data to edit
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnChanges() {
    if (this.rowData) {
      this.form = this.fb.group({});
      for (let key in this.rowData) {
        this.form.addControl(key, this.fb.control(this.rowData[key]));
      }
    }
  }

  onSave() {
    this.save.emit(this.form.value); // Emit updated data back to DataTableHComponent
  }

  onCancel() {
    this.cancel.emit();
  }
}

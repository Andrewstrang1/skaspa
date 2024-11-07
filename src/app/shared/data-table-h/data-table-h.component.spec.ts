import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableHComponent } from './data-table-h.component';

describe('DataTableHComponent', () => {
  let component: DataTableHComponent;
  let fixture: ComponentFixture<DataTableHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

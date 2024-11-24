import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTilesHComponent } from './data-tiles-h.component';

describe('DataTilesHComponent', () => {
  let component: DataTilesHComponent;
  let fixture: ComponentFixture<DataTilesHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTilesHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTilesHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

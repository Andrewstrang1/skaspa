import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponentHComponent } from './edit-component-h.component';

describe('EditComponentHComponent', () => {
  let component: EditComponentHComponent;
  let fixture: ComponentFixture<EditComponentHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditComponentHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditComponentHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

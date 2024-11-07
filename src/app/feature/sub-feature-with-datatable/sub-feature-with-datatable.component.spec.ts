import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFeatureWithDatatableComponent } from './sub-feature-with-datatable.component';

describe('SubFeatureWithDatatableComponent', () => {
  let component: SubFeatureWithDatatableComponent;
  let fixture: ComponentFixture<SubFeatureWithDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFeatureWithDatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubFeatureWithDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

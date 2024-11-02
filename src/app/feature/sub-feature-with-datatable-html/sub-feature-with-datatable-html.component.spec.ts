import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFeatureWithDatatableComponentHTML } from './sub-feature-with-datatable-html.component';

describe('SubFeatureWithDatatableHtmlComponent', () => {
  let component: SubFeatureWithDatatableComponentHTML;
  let fixture: ComponentFixture<SubFeatureWithDatatableComponentHTML>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFeatureWithDatatableComponentHTML ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubFeatureWithDatatableComponentHTML);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFeatureComponent } from './sub-feature.component';

describe('SubFeatureComponent', () => {
  let component: SubFeatureComponent;
  let fixture: ComponentFixture<SubFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

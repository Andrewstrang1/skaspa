import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFeatureTileViewComponent } from './sub-feature-tile-view.component';

describe('SubFeatureTileViewComponent', () => {
  let component: SubFeatureTileViewComponent;
  let fixture: ComponentFixture<SubFeatureTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFeatureTileViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubFeatureTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

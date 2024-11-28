import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTilesMusicComponent } from './data-tiles-music.component';

describe('DataTilesMusicComponent', () => {
  let component: DataTilesMusicComponent;
  let fixture: ComponentFixture<DataTilesMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTilesMusicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTilesMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

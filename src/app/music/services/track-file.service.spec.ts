import { TestBed } from '@angular/core/testing';

import { TrackFileService } from './track-file.service';

describe('TrackFileService', () => {
  let service: TrackFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ListingStatusService } from './listing-status.service';

describe('ListingStatusService', () => {
  let service: ListingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

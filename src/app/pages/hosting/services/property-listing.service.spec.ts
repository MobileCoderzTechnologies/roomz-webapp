import { TestBed } from '@angular/core/testing';

import { PropertyListingService } from './property-listing.service';

describe('PropertyListingService', () => {
  let service: PropertyListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

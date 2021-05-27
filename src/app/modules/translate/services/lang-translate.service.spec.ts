import { TestBed } from '@angular/core/testing';

import { LangTranslateService } from './lang-translate.service';

describe('LangTranslateService', () => {
  let service: LangTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

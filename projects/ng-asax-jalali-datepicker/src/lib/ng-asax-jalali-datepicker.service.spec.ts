import { TestBed } from '@angular/core/testing';

import { NgAsaxJalaliDatepickerService } from './ng-asax-jalali-datepicker.service';

describe('NgAsaxJalaliDatepickerService', () => {
  let service: NgAsaxJalaliDatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgAsaxJalaliDatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

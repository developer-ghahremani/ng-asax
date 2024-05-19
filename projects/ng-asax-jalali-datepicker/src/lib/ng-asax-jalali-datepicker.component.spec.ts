import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAsaxJalaliDatepickerComponent } from './ng-asax-jalali-datepicker.component';

describe('NgAsaxJalaliDatepickerComponent', () => {
  let component: NgAsaxJalaliDatepickerComponent;
  let fixture: ComponentFixture<NgAsaxJalaliDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgAsaxJalaliDatepickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgAsaxJalaliDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import moment, { Moment } from 'jalali-moment';

import { Component } from '@angular/core';
import { NgAsaxJalaliDatepickerComponent } from './../../projects/ng-asax-jalali-date-range-picker/src/lib/ng-asax-jalali-date-range-picker.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, NgAsaxJalaliDatepickerComponent],
})
export class AppComponent {
  handleChange({
    fromDate,
    toDate,
  }: {
    fromDate: moment.Moment;
    toDate: moment.Moment;
  }) {
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  fromDate: Moment = moment().startOf('jYear');
  minDate: Moment = moment().add(-1, 'jYear');
  maxDate: Moment = moment();
  toDate: Moment = moment();
}

import moment, { Moment } from 'jalali-moment';

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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

  fromDate: Moment = moment().add(-5, 'jDay');
  // fromDate: Moment = moment().startOf('jYear');
  minDate: Moment = moment().add(-1, 'jYear');
  maxDate: Moment = moment();
  toDate: Moment = moment();
}

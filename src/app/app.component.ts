import moment, { Moment } from 'jalali-moment';

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  isRightAlign: boolean = true;
  toDate: Moment = moment();
  maxDate: Moment = moment();
  minDate: Moment = moment().add(-1, 'jYear');
  fromDate: Moment = moment().add(-5, 'jDay');
  selected: 'inlineStyle' | 'separateStyle' = 'separateStyle';

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
}

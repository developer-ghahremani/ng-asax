import { AbstractControl, FormControl } from '@angular/forms';
import moment, { Moment } from 'jalali-moment';

import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isRightAlign: boolean = true;
  fromDate: Moment = moment().add(-5, 'jDay');
  minDate: Moment = moment().add(-1, 'jYear');
  maxDate: Moment = moment();
  toDate: Moment = moment();

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

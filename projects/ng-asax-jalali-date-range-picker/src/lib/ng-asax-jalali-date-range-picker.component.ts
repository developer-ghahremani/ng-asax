import {
  CalendarModel,
  OptionType,
  QuickOptionModel,
  daysOfWeek,
  monthsOfYear,
  quickNavigationOption,
  years,
} from './models/calendar.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import moment, {Moment} from 'jalali-moment';

import {range} from 'lodash';

@Component({
  selector: 'ng-asax-jalali-date-range-picker',
  styleUrls: [`./ng-asax-jalali-date-range-picker.component.scss`],
  templateUrl: `./ng-asax-jalali-date-range-picker.component.html`,
})
export class NgAsaxJalaliDatepickerComponent {
  showToYearPicker: boolean = false;
  showToMonthPicker: boolean = false;
  isComponentClicked: boolean = false;
  showFromYearPicker: boolean = false;
  showDateRangePicker: boolean = false;
  showFromMonthPicker: boolean = false;
  isFocusInsideComponent: boolean = false;
  dateFormat: string = 'jYYYY-jMM-jDD';
  OptionType: typeof OptionType = OptionType;

  _tempFromDate?: Moment;

  calendarConfig: { fromCalendar: CalendarModel; toCalendar: CalendarModel } = {
    fromCalendar: {
      year: moment().jYear(),
      month: 0,
      dayCount: 31,
      dayOfFirstDate: 0,
    },
    toCalendar: {
      year: moment().jYear(),
      month: 1,
      dayCount: 31,
      dayOfFirstDate: 0,
    },
  };

  quickNavigationOption: QuickOptionModel[] = quickNavigationOption;
  daysOfWeek: string[] = daysOfWeek;
  monthsOfYear: string[] = monthsOfYear;
  @Input() years: number[] = years;

  @Input() isRightAlign: boolean = true;
  @Input() toDate: Moment = moment();
  @Input() maxDate: Moment = moment();
  @Input() primaryColor: string = '#323E54';
  @Input() fromDate: Moment = moment().startOf('year');
  @ViewChild('dayInputNumber') dayInputNumber?: ElementRef;
  @Input() inputStyle: 'inlineStyle' | 'separateStyle' = 'separateStyle';
  @ViewChild('`monthInputNumber`') monthInputNumber?: ElementRef;
  @Input() minDate: Moment = moment().add(-2, 'jYear').startOf('year');
  @Output() onChange = new EventEmitter<{ fromDate: Moment; toDate: Moment }>();

  constructor() {
    moment.updateLocale('en', {week: {dow: 6, doy: 0}});
  }

  getWeekDayOfAYear(year: number, month: number): number {
    return moment(`${year}-${month + 1}-01`, this.dateFormat).weekday();
  }

  ngOnInit(): void {
    this.calendarConfig = {
      fromCalendar: {
        month: this.toDate.jMonth() === 0 ? 11 : this.toDate.jMonth() - 1,
        year: this.toDate.jMonth() === 0 ? this.toDate.jYear() - 1 : this.toDate.jYear(),
        dayCount: this.getDayCount(this.toDate.jMonth() === 11 ? this.toDate.jYear() - 1 : this.toDate.jYear(), this.toDate.jMonth() === 11 ? 0 : this.toDate.jMonth()),
        dayOfFirstDate: this.getWeekDayOfAYear(this.toDate.jMonth() === 11 ? this.toDate.jYear() - 1 : this.toDate.jYear(), this.toDate.jMonth() === 11 ? 0 : this.toDate.jMonth() - 1),
      },
      toCalendar: {
        month: this.toDate.jMonth(),
        year: this.toDate.jYear(),
        dayCount: this.getDayCount(this.toDate.jYear(), this.toDate.jMonth()),
        dayOfFirstDate: this.getWeekDayOfAYear(
          this.toDate.jYear(),
          this.toDate.jMonth(),
        ),
      },
    };
  }

  isInRange = (date: string): boolean => {
    if (this._tempFromDate !== undefined)
      return this._tempFromDate.format(this.dateFormat) === date;
    const day = moment(date, this.dateFormat);

    return (
      date === this.fromDate.format(this.dateFormat) ||
      (day.isSameOrAfter(this.fromDate) && day.isSameOrBefore(this.toDate))
    );
  };

  isFirstRangeDay = (date: string): boolean => {
    if (this._tempFromDate !== undefined)
      return this._tempFromDate.format(this.dateFormat) === date;
    return date === this.fromDate.format(this.dateFormat);
  };

  isLastRangeDay = (date: string): boolean => {
    return date === this.toDate.format(this.dateFormat);
  };

  isDisabled = (date: string): boolean => {
    const castedDate = moment(date, this.dateFormat);
    return (
      castedDate.isAfter(this.maxDate) || castedDate.isBefore(this.minDate)
    );
  };

  handleNext = () => {
    this.calendarConfig = {
      fromCalendar: {
        month:
          this.calendarConfig.fromCalendar.month === 11
            ? 0
            : this.calendarConfig.fromCalendar.month + 1,
        year:
          this.calendarConfig.fromCalendar.month === 11
            ? this.calendarConfig.fromCalendar.year + 1
            : this.calendarConfig.fromCalendar.year,
        dayCount:
          this.calendarConfig.fromCalendar.month === 10 &&
          this.isLeapYear(this.calendarConfig.fromCalendar.year)
            ? 30
            : this.calendarConfig.fromCalendar.month === 10
              ? 29
              : this.calendarConfig.fromCalendar.month < 5
                ? 31
                : this.calendarConfig.fromCalendar.month < 11
                  ? 30
                  : 31,
        dayOfFirstDate: moment(
          `${
            this.calendarConfig.fromCalendar.month === 11
              ? this.calendarConfig.fromCalendar.year + 1
              : this.calendarConfig.fromCalendar.year
          }-${
            this.calendarConfig.fromCalendar.month === 11
              ? 1
              : this.calendarConfig.fromCalendar.month + 2
          }-01`,
          this.dateFormat,
        ).weekday(),
      },

      toCalendar: {
        month:
          this.calendarConfig.toCalendar.month === 11
            ? 0
            : this.calendarConfig.toCalendar.month + 1,
        year:
          this.calendarConfig.toCalendar.month === 11
            ? this.calendarConfig.toCalendar.year + 1
            : this.calendarConfig.toCalendar.year,
        dayCount:
          this.getDayCount(this.calendarConfig.toCalendar.month === 11 ? this.calendarConfig.fromCalendar.year + 1 : this.calendarConfig.fromCalendar.year, this.calendarConfig.toCalendar.month === 11 ? 0 : this.calendarConfig.toCalendar.month + 1),
        dayOfFirstDate: this.getWeekDayOfAYear(
          this.calendarConfig.toCalendar.month === 11
            ? this.calendarConfig.toCalendar.year + 1
            : this.calendarConfig.toCalendar.year,
          this.calendarConfig.toCalendar.month === 11
            ? 0
            : this.calendarConfig.toCalendar.month + 1,
        ),
      },
    };
  };

  handlePrevious = () => {
    this.calendarConfig = {
      fromCalendar: {
        month: this.calendarConfig.fromCalendar.month === 0 ? 11 : this.calendarConfig.fromCalendar.month - 1,
        year: this.calendarConfig.fromCalendar.month === 0 ? this.calendarConfig.fromCalendar.year - 1 : this.calendarConfig.fromCalendar.year,
        dayCount: this.getDayCount(this.calendarConfig.fromCalendar.month === 0 ? this.calendarConfig.fromCalendar.year - 1 : this.calendarConfig.fromCalendar.year, this.calendarConfig.fromCalendar.month === 0 ? 11 : this.calendarConfig.fromCalendar.month - 1),
        dayOfFirstDate: this.getWeekDayOfAYear(this.calendarConfig.fromCalendar.month === 0 ? this.calendarConfig.fromCalendar.year - 1 : this.calendarConfig.fromCalendar.year, this.calendarConfig.fromCalendar.month === 0
          ? 11
          : this.calendarConfig.fromCalendar.month - 1,
        ),
      },
      toCalendar: {
        month:
          this.calendarConfig.toCalendar.month === 0
            ? 11
            : this.calendarConfig.toCalendar.month - 1,
        year:
          this.calendarConfig.toCalendar.month === 0
            ? this.calendarConfig.toCalendar.year - 1
            : this.calendarConfig.toCalendar.year,
        dayCount:
          this.getDayCount(this.calendarConfig.toCalendar.month === 0 ? this.calendarConfig.toCalendar.year - 1 : this.calendarConfig.toCalendar.year, this.calendarConfig.toCalendar.month === 0 ? 11 : this.calendarConfig.toCalendar.month - 1),
        dayOfFirstDate: moment(
          `${
            this.calendarConfig.toCalendar.month === 0
              ? this.calendarConfig.toCalendar.year - 1
              : this.calendarConfig.toCalendar.year
          }-${
            this.calendarConfig.toCalendar.month === 0
              ? 12
              : this.calendarConfig.toCalendar.month
          }-01`,
          this.dateFormat,
        ).weekday(),
      },
    };
  };

  toggleFromMonthPicker() {
    this.showFromMonthPicker = !this.showFromMonthPicker;
  }

  toggleToMonthPicker() {
    this.showToMonthPicker = !this.showToMonthPicker;
  }

  toggleFromYearPicker() {
    this.showFromYearPicker = !this.showFromYearPicker;
  }

  toggleToYearPicker() {
    this.showToYearPicker = !this.showToYearPicker;
  }

  isLeapYear(year: number): boolean {
    return moment(`${year}-01-02`, this.dateFormat).jIsLeapYear();
  }

  handleFromMonthClick(month: number) {
    this.calendarConfig = {
      fromCalendar: {
        ...this.calendarConfig.fromCalendar,
        month,
        dayOfFirstDate: this.getWeekDayOfAYear(
          this.calendarConfig.fromCalendar.year,
          month,
        ),
        dayCount:
          month === 11 && this.isLeapYear(this.calendarConfig.fromCalendar.year)
            ? 30
            : month === 11
              ? 29
              : month <= 5
                ? 31
                : month < 11
                  ? 30
                  : 29,
      },
      toCalendar: {
        ...this.calendarConfig.toCalendar,
        month: month === 11 ? 0 : month + 1,
        dayOfFirstDate: this.getWeekDayOfAYear(
          month === 11
            ? this.calendarConfig.fromCalendar.year + 1
            : this.calendarConfig.fromCalendar.year,
          month === 11 ? 0 : month + 1,
        ),
        dayCount:
          month === 10 && this.isLeapYear(this.calendarConfig.fromCalendar.year)
            ? 30
            : month === 10
              ? 29
              : month + 1 <= 5 || month === 11
                ? 31
                : month + 1 < 11
                  ? 30
                  : 29,
        year:
          month === 11
            ? this.calendarConfig.toCalendar.year + 1
            : this.calendarConfig.fromCalendar.year,
      },
    };
    this.showFromMonthPicker = false;
  }

  handleToMonthClick(month: number) {
    this.calendarConfig = {
      fromCalendar: {
        ...this.calendarConfig.fromCalendar,
        month: month === 0 ? 11 : month - 1,
        year:
          this.calendarConfig.fromCalendar.year !==
          this.calendarConfig.toCalendar.year
            ? this.calendarConfig.toCalendar.year
            : month === 0
              ? this.calendarConfig.fromCalendar.year - 1
              : this.calendarConfig.fromCalendar.year,
        dayCount:
          month === 0 &&
          this.isLeapYear(this.calendarConfig.fromCalendar.year - 1)
            ? 30
            : month === 0
              ? 29
              : month - 1 > 5
                ? 30
                : 31,
        dayOfFirstDate: this.getWeekDayOfAYear(
          month === 0
            ? this.calendarConfig.fromCalendar.year - 1
            : this.calendarConfig.fromCalendar.year,
          month === 0 ? 11 : month - 1,
        ),
      },
      toCalendar: {
        ...this.calendarConfig.toCalendar,
        month,
        dayOfFirstDate: this.getWeekDayOfAYear(
          this.calendarConfig.toCalendar.year,
          month,
        ),
        dayCount:
          month === 11 && this.isLeapYear(this.calendarConfig.toCalendar.year)
            ? 30
            : month === 11
              ? 29
              : month > 5
                ? 30
                : 31,
      },
    };
    this.showToMonthPicker = false;
  }

  getRangeDays(count: number): number[] {
    return range(1, count + 1, 1);
  }

  handleFromYearClick(year: number) {
    this.calendarConfig = {
      fromCalendar: {
        ...this.calendarConfig.fromCalendar,
        year,
        dayCount:
          this.calendarConfig.fromCalendar.month === 11 && this.isLeapYear(year)
            ? 30
            : this.calendarConfig.fromCalendar.month === 11
              ? 29
              : this.calendarConfig.fromCalendar.dayCount,
        dayOfFirstDate: this.getWeekDayOfAYear(
          year,
          this.calendarConfig.fromCalendar.month,
        ),
      },
      toCalendar: {
        ...this.calendarConfig.toCalendar,
        year: this.calendarConfig.fromCalendar.month === 11 ? year + 1 : year,
        dayCount:
          this.calendarConfig.toCalendar.month === 11 && this.isLeapYear(year)
            ? 30
            : this.calendarConfig.toCalendar.month === 11
              ? 29
              : this.calendarConfig.toCalendar.dayCount,
        dayOfFirstDate: this.getWeekDayOfAYear(
          year,
          this.calendarConfig.toCalendar.month,
        ),
      },
    };

    this.showFromYearPicker = false;
  }

  handleToYearClick(year: number) {
    this.calendarConfig = {
      fromCalendar: {
        ...this.calendarConfig.fromCalendar,
        year: this.calendarConfig.fromCalendar.month === 11 ? year - 1 : year,
        dayCount:
          this.calendarConfig.fromCalendar.month === 11 &&
          this.isLeapYear(year - 1)
            ? 30
            : this.calendarConfig.fromCalendar.month === 11
              ? 29
              : this.calendarConfig.fromCalendar.dayCount,
        dayOfFirstDate: this.getWeekDayOfAYear(
          this.calendarConfig.fromCalendar.month === 1 ? year - 1 : year,
          this.calendarConfig.fromCalendar.month,
        ),
      },
      toCalendar: {
        ...this.calendarConfig.toCalendar,
        year,
        dayCount:
          this.calendarConfig.toCalendar.month === 11 && this.isLeapYear(year)
            ? 30
            : this.calendarConfig.toCalendar.month === 11
              ? 29
              : this.calendarConfig.toCalendar.dayCount,
        dayOfFirstDate: this.getWeekDayOfAYear(
          year,
          this.calendarConfig.toCalendar.month,
        ),
      },
    };
    this.showToYearPicker = false;
  }

  handleClickDay(date: string) {
    if (this.isDisabled(date)) return;
    if (this._tempFromDate === undefined) {
      this._tempFromDate = moment(date, this.dateFormat);
      return;
    }

    if (moment(date, this.dateFormat).isBefore(this._tempFromDate)) {
      this._tempFromDate = moment(date, this.dateFormat);
      return;
    }

    this.onChange.emit({
      fromDate: this._tempFromDate,
      toDate: moment(date, this.dateFormat),
    });
    this._tempFromDate = undefined;
    // this.showDateRangePicker = false;
  }

  getDate(type: 'from' | 'to') {
    if (type === 'from') return this.fromDate.format(this.dateFormat);
    return this.toDate.format(this.dateFormat);
  }

  getDayCount(year: number, month: number): 29 | 30 | 31 {
    if (month === 11) {
      if (this.isLeapYear(year)) return 30;
      else return 29;
    }
    if (month <= 5) return 31;
    return 30;
  }

  getPersianTextDate(type: 'from' | 'to') {
    if (type === 'from')
      return `${this.fromDate.format('jD')} ${
        this.monthsOfYear[+this.fromDate.format('jM') - 1]
      } ${this.fromDate.format('jYYYY')}`;
    return `${this.toDate.format('jD')} ${
      this.monthsOfYear[+this.toDate.format('jM') - 1]
    } ${this.toDate.format('jYYYY')}`;
  }

  @HostListener('click')
  clickInside() {
    this.isFocusInsideComponent = true;
    this.isComponentClicked = true;
  }

  @HostListener('mousewheel', ['$event'])
  onMousewheel(event: { wheelDelta: number }) {
    if (event.wheelDelta > 0) {
      this.handlePrevious();
    }
    if (event.wheelDelta < 0) {
      this.handleNext();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleCloseDatePicker() {
    this.showDateRangePicker = false;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.isFocusInsideComponent && this.isComponentClicked) {
      this.showDateRangePicker = false;
      this.isComponentClicked = false;
    }
    this.isFocusInsideComponent = false;
  }

  handleOptionClicked(optionType: OptionType) {
    if (optionType !== OptionType.tillNow) this._tempFromDate = undefined;
    if (optionType === OptionType.fromFirstDayOfYear) {
      this.calendarConfig = {
        fromCalendar: {
          month: 0,
          dayCount: 31,
          year: moment().jYear(),
          dayOfFirstDate: this.getWeekDayOfAYear(moment().jYear(), 0),
        },
        toCalendar: {
          month: 1,
          dayCount: 31,
          year: moment().jYear(),
          dayOfFirstDate: this.getWeekDayOfAYear(moment().jYear(), 1),
        },
      };
      this.onChange.emit({
        fromDate: moment().startOf('jYear'),
        toDate: moment(),
      });
    }
    if (optionType === OptionType.fromFirstDayOfMonth) {
      this.calendarConfig = {
        fromCalendar: {
          month: moment().jMonth(),
          year: moment().jYear(),
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().jYear(),
            moment().jMonth(),
          ),
          dayCount:
            moment().jMonth() === 11 && this.isLeapYear(moment().jYear())
              ? 30
              : moment().jMonth() === 11
                ? 29
                : moment().jMonth() <= 5
                  ? 31
                  : 30,
        },
        toCalendar: {
          month: moment().jMonth() === 11 ? 0 : moment().jMonth() + 1,
          year:
            moment().jMonth() === 11 ? moment().jYear() + 1 : moment().jYear(),
          dayCount:
            moment().jMonth() === 10 && this.isLeapYear(moment().jYear())
              ? 30
              : moment().jMonth() === 11
                ? 31
                : moment().jMonth() <= 5
                  ? 30
                  : 30,
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().jMonth() === 11 ? moment().jYear() + 1 : moment().jYear(),
            moment().jMonth() === 11 ? 0 : moment().jMonth() + 1,
          ),
        },
      };
      this.onChange.emit({
        fromDate: moment().startOf('jMonth'),
        toDate: moment(),
      });
    }
    if (optionType === OptionType.fromFirstDayOfWeek) {
      this.calendarConfig = {
        fromCalendar: {
          month: moment().startOf('week').jMonth(),
          year: moment().startOf('week').jYear(),
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().startOf('week').jYear(),
            moment().startOf('week').jMonth(),
          ),
          dayCount:
            moment().startOf('week').jMonth() === 11 &&
            this.isLeapYear(moment().startOf('week').jYear())
              ? 30
              : moment().startOf('week').jMonth() === 11
                ? 29
                : moment().startOf('week').jMonth() <= 5
                  ? 31
                  : 30,
        },
        toCalendar: {
          month:
            moment().startOf('week').jMonth() === 11
              ? 1
              : moment().startOf('week').jMonth() + 1,
          year:
            moment().startOf('week').jMonth() === 11
              ? moment().startOf('week').jYear() + 1
              : moment().startOf('week').jYear(),
          dayCount:
            moment().startOf('week').jMonth() === 10 &&
            this.isLeapYear(moment().startOf('week').jYear())
              ? 30
              : moment().startOf('week').jMonth() === 10
                ? 29
                : moment().startOf('week').jMonth() <= 5
                  ? 31
                  : 30,
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().startOf('week').jYear(),
            moment().startOf('week').jMonth() === 11
              ? 0
              : moment().startOf('week').jMonth() + 1,
          ),
        },
      };
      this.onChange.emit({
        fromDate: moment().startOf('week'),
        toDate: moment(),
      });
    }
    if (optionType === OptionType.today) {
      this.calendarConfig = {
        fromCalendar: {
          month: moment().jMonth(),
          year: moment().jYear(),
          dayCount:
            moment().jMonth() === 0 && this.isLeapYear(moment().jYear())
              ? 30
              : moment().jMonth() === 0
                ? 29
                : moment().jMonth() > 5
                  ? 30
                  : 31,
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().jYear(),
            moment().jMonth(),
          ),
        },
        toCalendar: {
          year:
            moment().jMonth() === 11 ? moment().jYear() + 1 : moment().jYear(),
          month: moment().jMonth() === 11 ? 0 : moment().jMonth() + 1,
          dayCount:
            moment().jMonth() === 10 && this.isLeapYear(moment().jYear())
              ? 30
              : moment().jMonth() === 10
                ? 29
                : moment().jMonth() + 1 <= 5
                  ? 31
                  : 30,
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().jMonth() === 11 ? moment().jYear() + 1 : moment().jYear(),
            moment().jMonth() === 11 ? 0 : moment().jMonth() + 1,
          ),
        },
      };

      this.onChange.emit({
        fromDate: moment().startOf('jDay'),
        toDate: moment(),
      });
    }

    if (optionType === OptionType.lastWeek) {
      const firstDayOfWeek: Moment = moment()
        .startOf('w')
        .startOf('day')
        .add(-7, 'jDay');

      this.calendarConfig = {
        fromCalendar: {
          month: firstDayOfWeek.jMonth(),
          year: firstDayOfWeek.jYear(),
          dayCount:
            firstDayOfWeek.jMonth() === 11 &&
            this.isLeapYear(firstDayOfWeek.jYear())
              ? 30
              : firstDayOfWeek.jMonth() === 11
                ? 29
                : firstDayOfWeek.jMonth() > 5
                  ? 30
                  : 31,
          dayOfFirstDate: this.getWeekDayOfAYear(
            firstDayOfWeek.jYear(),
            firstDayOfWeek.jMonth(),
          ),
        },

        toCalendar: {
          year:
            firstDayOfWeek.jMonth() === 11
              ? firstDayOfWeek.jYear() + 1
              : firstDayOfWeek.jYear(),
          month:
            firstDayOfWeek.jMonth() === 11 ? 0 : firstDayOfWeek.jMonth() + 1,
          dayCount:
            firstDayOfWeek.jMonth() === 10 &&
            this.isLeapYear(firstDayOfWeek.jYear())
              ? 30
              : firstDayOfWeek.jMonth() === 10
                ? 29
                : firstDayOfWeek.jMonth() + 1 <= 5
                  ? 31
                  : 30,
          dayOfFirstDate: this.getWeekDayOfAYear(
            firstDayOfWeek.jMonth() === 11
              ? firstDayOfWeek.jYear() + 1
              : firstDayOfWeek.jYear(),
            firstDayOfWeek.jMonth() === 11 ? 0 : firstDayOfWeek.jMonth() + 1,
          ),
        },
      };
      this.onChange.emit({
        fromDate: firstDayOfWeek,
        toDate: firstDayOfWeek.clone().add(6, 'day'),
      });
    }

    if (optionType === OptionType.tillNow) {
      this.calendarConfig = {
        toCalendar: {
          year: moment().jYear(),
          month: moment().jMonth(),
          dayCount:
            moment().jMonth() === 11 && this.isLeapYear(moment().jYear())
              ? 30
              : moment().jMonth() === 11
                ? 29
                : moment().jMonth() <= 5
                  ? 31
                  : 30,
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().jYear(),
            moment().jMonth(),
          ),
        },
        fromCalendar: {
          year:
            moment().jMonth() === 0 ? moment().jYear() - 1 : moment().jYear(),
          month: moment().jMonth() === 0 ? 11 : moment().jMonth() - 1,
          dayCount:
            moment().jMonth() === 0 && this.isLeapYear(moment().jYear() - 1)
              ? 30
              : moment().jMonth() === 0
                ? 29
                : moment().jMonth() - 1 > 6
                  ? 30
                  : 31,
          dayOfFirstDate: this.getWeekDayOfAYear(
            moment().jMonth() === 0 ? moment().jYear() - 1 : moment().jYear(),
            moment().jMonth() === 0 ? 11 : moment().jMonth() - 1,
          ),
        },
      };

      this.onChange.emit({
        fromDate: this._tempFromDate?.clone().startOf('day') || moment(),
        toDate: moment(),
      });
      this._tempFromDate = undefined;
    }
  }
}

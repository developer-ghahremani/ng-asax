import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import moment, { Moment } from 'jalali-moment';

import range from 'lodash/range';

enum OptionType {
  fromFirstDayOfYear = 'fromFirstDayOfYear',
  fromFirstDayOfMonth = 'fromFirstDayOfMonth',
  fromFirstDayOfWeek = 'fromFirstDayOfWeek',
  lastWeek = 'lastWeek',
  tillNow = 'tillNow',
  today = 'today',
}

@Component({
  selector: 'ng-asax-jalali-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./ng-asax-jalali-date-range-picker.component.html`,
  styleUrls: [`./ng-asax-jalali-date-range-picker.component.scss`],
})
export class NgAsaxJalaliDatepickerComponent {
  showToYearPicker: boolean = false;
  showToMonthPicker: boolean = false;
  isComponentClicked: boolean = false;
  showFromYearPicker: boolean = false;
  showDateRangePicker: boolean = false;
  showFromMonthPicker: boolean = false;
  isFocusInsideComponent: boolean = false;

  OptionType = OptionType;
  _toCalendar: {
    year: number;
    month: number;
    dayCount: 31 | 30 | 29;
    dayOfFirstDate: number;
  } = { year: moment().jYear(), month: 0, dayCount: 31, dayOfFirstDate: 0 };
  _fromCalendar: {
    year: number;
    month: number;
    dayCount: 31 | 30 | 29;
    dayOfFirstDate: number;
  } = { year: moment().jYear(), month: 1, dayCount: 31, dayOfFirstDate: 0 };

  _tempFromDate?: Moment;
  options: { title: string; type: OptionType; disabled?: boolean }[] = [
    {
      title: 'امروز',
      type: OptionType.today,
    },
    {
      title: 'هفته گذشته',
      type: OptionType.lastWeek,
    },
    {
      title: 'اول هفته تا امروز',
      type: OptionType.fromFirstDayOfWeek,
    },
    {
      title: 'اول ماه تا امروز',
      type: OptionType.fromFirstDayOfMonth,
    },
    {
      title: 'اول سال تا امروز',
      type: OptionType.fromFirstDayOfYear,
    },
  ];
  daysOfWeek: string[] = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  years: number[] = Array.from({ length: 15 }, (_, i) => 1392 + i);
  monthsOfYear: string[] = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  @ViewChild('monthInputNumber') monthInputNumber?: ElementRef;
  @ViewChild('dayInputNumber') dayInputNumber?: ElementRef;
  @Input() isRightAlign: boolean = true;
  @Input() fromDate: Moment = moment().startOf('year');
  @Input() minDate: Moment = moment().add(-2, 'jYear').startOf('year');
  @Input() toDate: Moment = moment();
  @Input() maxDate: Moment = moment();
  @Output() onChange = new EventEmitter<{ fromDate: Moment; toDate: Moment }>();

  constructor() {
    moment.updateLocale('en', { week: { dow: 6, doy: 0 } });
  }

  getWeekDayOfAYear(year: number, month: number): number {
    return moment(`${year}-${month + 1}-01`, 'jYYYY-jMM-jDD').weekday();
  }

  ngOnInit(): void {
    this._fromCalendar = {
      month: this.toDate.jMonth() === 11 ? 0 : this.toDate.jMonth() - 1,
      year:
        this.toDate.jMonth() === 11
          ? this.toDate.jYear() - 1
          : this.toDate.jYear(),
      dayCount:
        this.toDate.jMonth() === 11 && this.isLeapYear(this.toDate.jYear() - 1)
          ? 30
          : this.toDate.jMonth() === 11
          ? 29
          : this.toDate.jMonth() - 1 <= 5
          ? 31
          : this.toDate.jMonth() - 1 < 11
          ? 30
          : 29,
      dayOfFirstDate: this.getWeekDayOfAYear(
        this.toDate.jMonth() === 11
          ? this.toDate.jYear() - 1
          : this.toDate.jYear(),
        this.toDate.jMonth() === 11 ? 0 : this.toDate.jMonth() - 1
      ),
    };
    this._toCalendar = {
      month: this.toDate.jMonth(),
      year: this.toDate.jYear(),
      dayCount:
        this.toDate.jMonth() === 11 && this.isLeapYear(this.toDate.jYear())
          ? 30
          : this.toDate.jMonth() === 11
          ? 29
          : this.toDate.jMonth() <= 5
          ? 31
          : 30,
      dayOfFirstDate: this.getWeekDayOfAYear(
        this.toDate.jYear(),
        this.toDate.jMonth()
      ),
    };
  }

  isInRange = (date: string): boolean => {
    if (this._tempFromDate !== undefined)
      return this._tempFromDate.format('jYYYY-jMM-jDD') === date;
    const day = moment(date, 'jYYYY-jMM-jDD');
    return day.isSameOrAfter(this.fromDate) && day.isSameOrBefore(this.toDate);
  };

  isFirstRangeDay = (date: string): boolean => {
    if (this._tempFromDate !== undefined)
      return this._tempFromDate.format('jYYYY-jMM-jDD') === date;
    return date === this.fromDate.format('jYYYY-jMM-jDD');
  };

  isLastRangeDay = (date: string): boolean => {
    return date === this.toDate.format('jYYYY-jMM-jDD');
  };

  isDisabled = (date: string): boolean => {
    const castedDate = moment(date, 'jYYYY-jMM-jDD');
    return (
      castedDate.isAfter(this.maxDate) || castedDate.isBefore(this.minDate)
    );
  };

  toggleShowDateRangePicker() {
    this.showDateRangePicker = !this.showDateRangePicker;
  }

  handleNext = () => {
    this._fromCalendar = {
      month: this._fromCalendar.month === 11 ? 0 : this._fromCalendar.month + 1,
      year:
        this._fromCalendar.month === 11
          ? this._fromCalendar.year + 1
          : this._fromCalendar.year,
      dayCount:
        this._fromCalendar.month === 10 &&
        this.isLeapYear(this._fromCalendar.year)
          ? 30
          : this._fromCalendar.month === 10
          ? 29
          : this._fromCalendar.month < 5
          ? 31
          : this._fromCalendar.month < 11
          ? 30
          : 31,
      dayOfFirstDate: moment(
        `${
          this._fromCalendar.month === 11
            ? this._fromCalendar.year + 1
            : this._fromCalendar.year
        }-${
          this._fromCalendar.month === 11 ? 1 : this._fromCalendar.month + 2
        }-01`,
        'jYYYY-jMM-jDD'
      ).weekday(),
    };

    this._toCalendar = {
      month: this._toCalendar.month === 11 ? 0 : this._toCalendar.month + 1,
      year:
        this._toCalendar.month === 11
          ? this._toCalendar.year + 1
          : this._toCalendar.year,
      dayCount:
        this._toCalendar.month === 11
          ? 31
          : this._fromCalendar.month === 10 &&
            this.isLeapYear(this._fromCalendar.year)
          ? 30
          : this._fromCalendar.month === 10 &&
            !this.isLeapYear(this._fromCalendar.year)
          ? 29
          : this._fromCalendar.month <= 4
          ? 31
          : 30,
      dayOfFirstDate: this.getWeekDayOfAYear(
        this._toCalendar.month === 11
          ? this._toCalendar.year + 1
          : this._toCalendar.year,
        this._toCalendar.month === 11 ? 0 : this._toCalendar.month + 1
      ),
    };
  };

  handlePrevious = () => {
    this._fromCalendar = {
      month: this._fromCalendar.month === 0 ? 11 : this._fromCalendar.month - 1,
      year:
        this._fromCalendar.month === 0
          ? this._fromCalendar.year - 1
          : this._fromCalendar.year,
      dayCount:
        this._fromCalendar.month === 0 &&
        this.isLeapYear(this._fromCalendar.year - 1)
          ? 30
          : this._fromCalendar.month === 0
          ? 29
          : this._fromCalendar.month - 1 <= 5
          ? 31
          : 30,
      dayOfFirstDate: this.getWeekDayOfAYear(
        this._fromCalendar.month === 0
          ? this._fromCalendar.year - 1
          : this._fromCalendar.year,
        this._fromCalendar.month === 0 ? 11 : this._fromCalendar.month - 1
      ),
    };
    this._toCalendar = {
      month: this._toCalendar.month === 0 ? 11 : this._toCalendar.month - 1,
      year:
        this._toCalendar.month === 0
          ? this._toCalendar.year - 1
          : this._toCalendar.year,
      dayCount:
        this._toCalendar.month === 0 &&
        this.isLeapYear(this._toCalendar.year - 1)
          ? 30
          : this._toCalendar.month === 0
          ? 29
          : this._toCalendar.month - 1 <= 5
          ? 31
          : 30,
      dayOfFirstDate: moment(
        `${
          this._toCalendar.month === 0
            ? this._toCalendar.year - 1
            : this._toCalendar.year
        }-${this._toCalendar.month === 0 ? 12 : this._toCalendar.month}-01`,
        'jYYYY-jMM-jDD'
      ).weekday(),
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
    return moment(`${year}-01-02`, 'jYYYY-jMM-jDD').jIsLeapYear();
  }

  handleFromMonthClick(month: number) {
    this._fromCalendar = {
      ...this._fromCalendar,
      month,
      dayOfFirstDate: this.getWeekDayOfAYear(this._fromCalendar.year, month),
      dayCount:
        month === 11 && this.isLeapYear(this._fromCalendar.year)
          ? 30
          : month === 11
          ? 29
          : month <= 5
          ? 31
          : month < 11
          ? 30
          : 29,
    };
    this._toCalendar = {
      ...this._toCalendar,
      month: month === 11 ? 0 : month + 1,
      dayOfFirstDate: this.getWeekDayOfAYear(
        month === 11 ? this._fromCalendar.year + 1 : this._fromCalendar.year,
        month === 11 ? 0 : month + 1
      ),
      dayCount:
        month === 10 && this.isLeapYear(this._fromCalendar.year)
          ? 30
          : month === 10
          ? 29
          : month + 1 <= 5 || month === 11
          ? 31
          : month + 1 < 11
          ? 30
          : 29,
      year: month === 11 ? this._toCalendar.year + 1 : this._fromCalendar.year,
    };
    this.showFromMonthPicker = false;
  }

  handleToMonthClick(month: number) {
    this._fromCalendar = {
      ...this._fromCalendar,
      month: month === 0 ? 11 : month - 1,
      year:
        this._fromCalendar.year !== this._toCalendar.year
          ? this._toCalendar.year
          : month === 0
          ? this._fromCalendar.year - 1
          : this._fromCalendar.year,
      dayCount:
        month === 0 && this.isLeapYear(this._fromCalendar.year - 1)
          ? 30
          : month === 0
          ? 29
          : month - 1 > 5
          ? 30
          : 31,
      dayOfFirstDate: this.getWeekDayOfAYear(
        month === 0 ? this._fromCalendar.year - 1 : this._fromCalendar.year,
        month === 0 ? 11 : month - 1
      ),
    };
    this._toCalendar = {
      ...this._toCalendar,
      month,
      dayOfFirstDate: this.getWeekDayOfAYear(this._toCalendar.year, month),
      dayCount:
        month === 11 && this.isLeapYear(this._toCalendar.year)
          ? 30
          : month === 0
          ? 29
          : month > 5
          ? 30
          : 31,
    };
    this.showToMonthPicker = false;
  }

  getRangeDays(count: number): number[] {
    return range(1, count + 1, 1);
  }

  handleFromYearClick(year: number) {
    this._fromCalendar = {
      ...this._fromCalendar,
      year,
      dayCount:
        this._fromCalendar.month === 11 && this.isLeapYear(year)
          ? 30
          : this._fromCalendar.month === 11
          ? 29
          : this._fromCalendar.dayCount,
      dayOfFirstDate: this.getWeekDayOfAYear(year, this._fromCalendar.month),
    };
    this._toCalendar = {
      ...this._toCalendar,
      year: this._fromCalendar.month === 11 ? year + 1 : year,
      dayCount:
        this._toCalendar.month === 11 && this.isLeapYear(year)
          ? 30
          : this._toCalendar.month === 11
          ? 29
          : this._toCalendar.dayCount,
      dayOfFirstDate: this.getWeekDayOfAYear(year, this._toCalendar.month),
    };

    this.showFromYearPicker = false;
  }

  handleToYearClick(year: number) {
    this._fromCalendar = {
      ...this._fromCalendar,
      year: this._fromCalendar.month === 11 ? year - 1 : year,
      dayCount:
        this._fromCalendar.month === 11 && this.isLeapYear(year - 1)
          ? 30
          : this._fromCalendar.month === 11
          ? 29
          : this._fromCalendar.dayCount,
      dayOfFirstDate: this.getWeekDayOfAYear(
        this._fromCalendar.month === 1 ? year - 1 : year,
        this._fromCalendar.month
      ),
    };
    this._toCalendar = {
      ...this._toCalendar,
      year,
      dayCount:
        this._toCalendar.month === 11 && this.isLeapYear(year)
          ? 30
          : this._toCalendar.month === 11
          ? 29
          : this._toCalendar.dayCount,
      dayOfFirstDate: this.getWeekDayOfAYear(year, this._toCalendar.month),
    };
    this.showToYearPicker = false;
  }

  handleClickDay(date: string) {
    if (this.isDisabled(date)) return;
    if (this._tempFromDate === undefined) {
      this._tempFromDate = moment(date, 'jYYYY-jMM-jDD');
      return;
    }

    if (moment(date, 'jYYYY-jMM-jDD').isBefore(this._tempFromDate)) {
      this._tempFromDate = moment(date, 'jYYYY-jMM-jDD');
      return;
    }

    this.onChange.emit({
      fromDate: this._tempFromDate,
      toDate: moment(date, 'jYYYY-jMM-jDD'),
    });
    this._tempFromDate = undefined;
    // this.showDateRangePicker = false;
  }

  getDate(type: 'from' | 'to') {
    if (type === 'from') return this.fromDate.format('jYYYY-jMM-jDD');
    return this.toDate.format('jYYYY-jMM-jDD');
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
      this._fromCalendar = {
        month: 0,
        dayCount: 31,
        year: moment().jYear(),
        dayOfFirstDate: this.getWeekDayOfAYear(moment().jYear(), 0),
      };
      this._toCalendar = {
        month: 1,
        dayCount: 31,
        year: moment().jYear(),
        dayOfFirstDate: this.getWeekDayOfAYear(moment().jYear(), 1),
      };
      this.onChange.emit({
        fromDate: moment().startOf('jYear'),
        toDate: moment(),
      });
    }
    if (optionType === OptionType.fromFirstDayOfMonth) {
      this._fromCalendar = {
        month: moment().jMonth(),
        year: moment().jYear(),
        dayOfFirstDate: this.getWeekDayOfAYear(
          moment().jYear(),
          moment().jMonth()
        ),
        dayCount:
          moment().jMonth() === 11 && this.isLeapYear(moment().jYear())
            ? 30
            : moment().jMonth() === 11
            ? 29
            : moment().jMonth() <= 5
            ? 31
            : 30,
      };
      this._toCalendar = {
        month: moment().jMonth() === 11 ? 1 : moment().jMonth() + 1,
        year:
          moment().jMonth() === 11 ? moment().jYear() + 1 : moment().jYear(),
        dayCount:
          moment().jMonth() === 10 && this.isLeapYear(moment().jYear())
            ? 30
            : moment().jMonth() === 10
            ? 29
            : moment().jMonth() <= 5
            ? 31
            : 30,
        dayOfFirstDate: this.getWeekDayOfAYear(
          moment().jYear(),
          moment().jMonth() === 11 ? 0 : moment().jMonth() + 1
        ),
      };
      this.onChange.emit({
        fromDate: moment().startOf('jMonth'),
        toDate: moment(),
      });
    }
    if (optionType === OptionType.fromFirstDayOfWeek) {
      this._fromCalendar = {
        month: moment().startOf('week').jMonth(),
        year: moment().startOf('week').jYear(),
        dayOfFirstDate: this.getWeekDayOfAYear(
          moment().startOf('week').jYear(),
          moment().startOf('week').jMonth()
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
      };
      this._toCalendar = {
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
            : moment().startOf('week').jMonth() + 1
        ),
      };
      this.onChange.emit({
        fromDate: moment().startOf('week'),
        toDate: moment(),
      });
    }
    if (optionType === OptionType.today) {
      this._fromCalendar = {
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
          moment().jMonth()
        ),
      };

      this._toCalendar = {
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
          moment().jMonth() === 11 ? 0 : moment().jMonth() + 1
        ),
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

      this._fromCalendar = {
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
          firstDayOfWeek.jMonth()
        ),
      };

      this._toCalendar = {
        year:
          firstDayOfWeek.jMonth() === 11
            ? firstDayOfWeek.jYear() + 1
            : firstDayOfWeek.jYear(),
        month: firstDayOfWeek.jMonth() === 11 ? 0 : firstDayOfWeek.jMonth() + 1,
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
          firstDayOfWeek.jMonth() === 11 ? 0 : firstDayOfWeek.jMonth() + 1
        ),
      };

      this.onChange.emit({
        fromDate: firstDayOfWeek,
        toDate: firstDayOfWeek.clone().add(6, 'day'),
      });
    }

    if (optionType === OptionType.tillNow) {
      this._toCalendar = {
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
          moment().jMonth()
        ),
      };

      this._fromCalendar = {
        year: moment().jMonth() === 0 ? moment().jYear() - 1 : moment().jYear(),
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
          moment().jMonth() === 0 ? 11 : moment().jMonth() - 1
        ),
      };

      this.onChange.emit({
        fromDate: this._tempFromDate?.clone().startOf('day') || moment(),
        toDate: moment(),
      });
      this._tempFromDate = undefined;
    }
  }

  setMonth() {
    if (!this.monthInputNumber) return;
    this._tempFromDate = undefined;
    const startDate = moment()
      .add(+this.monthInputNumber.nativeElement.value * -1, 'jmonth')
      .startOf('jDay');
    this._toCalendar = {
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
        moment().jMonth()
      ),
    };
    this._fromCalendar = {
      year: moment().jMonth() === 11 ? moment().jYear() - 1 : moment().jYear(),
      month: moment().jMonth() === 11 ? 0 : moment().jMonth() - 1,
      dayCount:
        moment().jMonth() === 11 && this.isLeapYear(moment().jYear() - 1)
          ? 30
          : moment().jMonth() === 11
          ? 29
          : moment().jMonth() - 1 <= 5
          ? 31
          : 30,
      dayOfFirstDate: this.getWeekDayOfAYear(
        moment().jMonth() === 11 ? moment().jYear() - 1 : moment().jYear(),
        moment().jMonth() == 11 ? 0 : moment().jMonth() - 1
      ),
    };

    this.onChange.emit({
      fromDate: startDate,
      toDate: moment(),
    });

    this.monthInputNumber.nativeElement.value = '';
  }
  setDay() {
    if (!this.dayInputNumber) return;
    this._tempFromDate = undefined;
    const startDate = moment()
      .add(+this.dayInputNumber.nativeElement.value * -1, 'jDay')
      .startOf('jDay');
    this._toCalendar = {
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
        moment().jMonth()
      ),
    };
    this._fromCalendar = {
      year: moment().jMonth() === 11 ? moment().jYear() - 1 : moment().jYear(),
      month: moment().jMonth() === 11 ? 0 : moment().jMonth() - 1,
      dayCount:
        moment().jMonth() === 11 && this.isLeapYear(moment().jYear() - 1)
          ? 30
          : moment().jMonth() === 11
          ? 29
          : moment().jMonth() - 1 <= 5
          ? 31
          : 30,
      dayOfFirstDate: this.getWeekDayOfAYear(
        moment().jMonth() === 11 ? moment().jYear() - 1 : moment().jYear(),
        moment().jMonth() == 11 ? 0 : moment().jMonth() - 1
      ),
    };

    this.onChange.emit({
      fromDate: startDate,
      toDate: moment(),
    });

    this.dayInputNumber.nativeElement.value = '';
  }
}

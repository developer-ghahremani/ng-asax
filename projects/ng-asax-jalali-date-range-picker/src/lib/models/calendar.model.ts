export interface CalendarModel {
  year: number;
  month: number;
  dayCount: 31 | 30 | 29;
  dayOfFirstDate: number;
}

export const daysOfWeek: string[] = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const years: number[] = Array.from({ length: 15 }, (_, i) => 1392 + i);
export const monthsOfYear: string[] = [
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
export enum OptionType {
  fromFirstDayOfYear = 'fromFirstDayOfYear',
  fromFirstDayOfMonth = 'fromFirstDayOfMonth',
  fromFirstDayOfWeek = 'fromFirstDayOfWeek',
  lastWeek = 'lastWeek',
  tillNow = 'tillNow',
  today = 'today',
}

export interface QuickOptionModel {
  title: string;
  type: OptionType;
  disabled?: boolean;
}

export const quickNavigationOption: QuickOptionModel[] = [
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

# Angular ASAX Jalali DatePicker

This is a configurable jalali (persian, khorshidi, shamsi) date-picker build for Angular 2 applications and uses [jalali-moment](https://github.com/fingerpich/moment-jalaali) as its dependency.

## Screenshots

<div>
<img alt="date picker" src="https://github.com/developer-ghahremani/ng-asax/blob/master/projects/ng-asax-jalali-date-range-picker/screenshots/ng_asax.gif?raw=true"width="605px" >
</div>

<div>
<img alt="date picker" src="https://github.com/developer-ghahremani/ng-asax/blob/master/projects/ng-asax-jalali-date-range-picker/screenshots/ng_asax.png?raw=true"width="300px" >
<img alt="date picker" src="https://github.com/developer-ghahremani/ng-asax/blob/master/projects/ng-asax-jalali-date-range-picker/screenshots/ng_asax_2.png?raw=true"width="300px" >
</div>

1. Download from npm:
   `npm install ng-asax-jalali-date-picker`
2. import the `NgAsaxJalaliDatepickerModule` module in typescript (.ts) or es6 files like below:  
   `import { NgAsaxJalaliDatepickerModule } from 'ng-asax-jalali-date-range-picker';`
3. Add `NgAsaxJalaliDatepickerModule` to your module imports:

```ts
 @NgModule({
   ...
   imports: [
     ...
     NgAsaxJalaliDatepickerModule
   ]
 })
```

## How to use

```html
<ng-asax-jalali-date-range-picker [toDate]="toDate" [fromDate]="fromDate" [maxDate]="maxDate" [minDate]="minDate" (onChange)="handleChange($event)"></ng-asax-jalali-date-range-picker>
```

```ts
import moment, { Moment } from "jalali-moment";

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  handleChange({ fromDate, toDate }: { fromDate: moment.Moment; toDate: moment.Moment }) {
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  fromDate: Moment = moment().startOf("jYear");
  minDate: Moment = moment().add(-1, "jYear");
  maxDate: Moment = moment();
  toDate: Moment = moment();
}
```

<!-- [Demo](https://plnkr.co/XJSWtt) -->

#### How to use the output as a jalali (shamsi) date

```ts
import * as moment from 'jalali-moment';
dateObject.format('jYYYY/jMM/jD)'
```

read [jalali-moment](https://github.com/fingerpich/jalali-moment)

<!-- #### How to use it with system.js -->

<!-- [this Demo](https://plnkr.co/XJSWtt) is using system.js. -->

### Attributes (Input):

all attributes in the following table could be used as

|   Name   | Type     | Default                                    | Description                                                                                                                                                                                             |
| :------: | -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fromDate | `Moment` | `moment().startOf('year')`                 | This is a validation rule, if the selected date will be before `minDate` the containing form will be invalid. Note: if provided as string format configuration should be provided in the config object. |
|  toDate  | `Moment` | `moment()`                                 | This is a validation rule, if the selected date will be before `minDate` the containing form will be invalid. Note: if provided as string format configuration should be provided in the config object. |
| minDate  | `Moment` | `moment().add(-1,'jYear').startOf('year')` | This is a validation rule, if the selected date will be before `minDate` the containing form will be invalid. Note: if provided as string format configuration should be provided in the config object. |
| maxDate  | `Moment` | `moment()`                                 | This is a validation rule, if the selected date will be before `minDate` the containing form will be invalid. Note: if provided as string format configuration should be provided in the config object. |

### Attributes (Output):

| Name     | Event Arguments | Applies To  | Description                                                                                                                                                  |
| -------- | :-------------: | :---------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| onChange | `CalendarValue` | All Pickers | This event will be emitted on every valid value change, if you want to receive every value (valid and invalid) please use the native `ngModelChange` output. |

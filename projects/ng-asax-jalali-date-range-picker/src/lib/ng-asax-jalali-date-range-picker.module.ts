import { CommonModule } from '@angular/common';
import { ISvgIconModule } from './components/svg-icon/svg-icon.module';
import { InputContainerComponent } from './components/input_container/input_container.component';
import { NgAsaxJalaliDatepickerComponent } from './ng-asax-jalali-date-range-picker.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [NgAsaxJalaliDatepickerComponent, InputContainerComponent],
  imports: [CommonModule, ISvgIconModule],
  exports: [NgAsaxJalaliDatepickerComponent, InputContainerComponent],
})
export class NgAsaxJalaliDatepickerModule {}

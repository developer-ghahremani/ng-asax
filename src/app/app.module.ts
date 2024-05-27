import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgAsaxJalaliDatepickerModule } from '../../projects/ng-asax-jalali-date-range-picker/src/public-api';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgAsaxJalaliDatepickerModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

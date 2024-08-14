import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgAsaxJalaliDatepickerModule } from '../../projects/ng-asax-jalali-date-range-picker/src/public-api';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgAsaxJalaliDatepickerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Component } from '@angular/core';
import { NgAsaxJalaliDatepickerComponent } from './../../projects/ng-asax-jalali-datepicker/src/lib/ng-asax-jalali-datepicker.component';
import { RouterOutlet } from '@angular/router';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, NgAsaxJalaliDatepickerComponent],
})
export class AppComponent {
  title = 'ng-asax';
}

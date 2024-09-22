import { Component, Input } from '@angular/core';

import icons from './icons.json'; // Make sure the path to your JSON file is correct

@Component({
  selector: 'app-svg-icon',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.width]="width"
      [attr.height]="height"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path *ngFor="let path of icon" [attr.d]="path"></path>
    </svg>
  `,
})
export class ISvgIcon {
  @Input() name: string = '';
  @Input() width: string = '18';
  @Input() height: string = '18';
  @Input() fill: string = 'none';
  @Input() stroke: string = 'currentColor';
  @Input() strokeWidth: string = '1.5';

  get icon() {
    return icons[this.name];
  }
}

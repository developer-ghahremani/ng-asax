import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-container-component',
  styleUrls: ['./input_container.component.scss'],
  templateUrl: './input_container.component.html',
})
export class InputContainerComponent {
  @Input() toDate: string = '';
  @Input() fromDate: string = '';
  @Output() onTogglePicker = new EventEmitter();
  @Input() inputStyle: 'inlineStyle' | 'separateStyle' = 'separateStyle';

  handleTogglePicker() {
    this.onTogglePicker.emit();
  }
}

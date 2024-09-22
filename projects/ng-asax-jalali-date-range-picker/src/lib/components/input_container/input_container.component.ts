import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-container-component',
  templateUrl: './input_container.component.html',
  styleUrls: ['./input_container.component.scss'],
})
export class InputContainerComponent {
  @Input() toDate: string = '';
  @Input() fromDate: string = '';
  @Output() onTogglePicker = new EventEmitter();
  @Input() inputStyle: 'inlineStyle' | 'separateStyle' = 'inlineStyle';

  handleTogglePicker() {
    this.onTogglePicker.emit();
  }
}

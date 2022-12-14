
import { Component, forwardRef, ChangeDetectorRef, Input } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-input',
  template: `<input  [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" class="cellinput" [(ngModel)]="value" [disabled]="disabled" />`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveInputComponent), multi: true } ]
})
export class ReactiveInputComponent extends ReactiveBaseComponent {

  @Input() disabled;

  constructor( protected ref: ChangeDetectorRef ) {
    super( ref );
  }
}

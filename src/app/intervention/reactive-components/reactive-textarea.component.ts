
import { Component, forwardRef, ChangeDetectorRef, Input } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-textarea',
  template: `<textarea  [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" [(ngModel)]="value" [disabled]="disabled" ></textarea>`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveTextareaComponent), multi: true } ]
})
export class ReactiveTextareaComponent extends ReactiveBaseComponent {

  @Input() disabled;

  constructor( protected ref: ChangeDetectorRef ) {
    super( ref );
  }
}

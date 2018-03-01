
import { Component, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-textarea',
  template: `<textarea  [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" [(ngModel)]="value"></textarea>`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveTextareaComponent), multi: true } ]
})
export class ReactiveTextareaComponent extends ReactiveBaseComponent {

  constructor( protected ref: ChangeDetectorRef ) { 
    super( ref );
  }
}

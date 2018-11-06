
import { Component, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-date.input',
  template: `<input  [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" class="cellinput" [(ngModel)]="value"  />`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveDateInputComponent), multi: true } ]
})
export class ReactiveDateInputComponent extends ReactiveBaseComponent {

  constructor( protected ref: ChangeDetectorRef ) { 
    super( ref );
  }

  // change from the UI
  set value2(event: any)
  {
    this._value = event;
    this.propagateChange(event);
    this.updatingState = null;
  }

  get value2()
  {
    return this._value;
  }

}

import { Component, forwardRef, ChangeDetectorRef, Input } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-checkbox',
  template: `
  <label class="container" [class.transition_1s]="!isThirdParty" [class.textChange]="isThirdParty">{{label}}
    <input class="inputcheckbox" type="checkbox" [(ngModel)]="value" />
    <span  class="checkmark" [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty"></span>
  </label>
  `,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveCheckboxComponent), multi: true } ]
})
export class ReactiveCheckboxComponent extends ReactiveBaseComponent {

  @Input() label = '';

  constructor( protected ref: ChangeDetectorRef ) {
    super( ref );
  }
}

import { Component, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-select',
  template: `
    <select [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" [(ngModel)]="value">
      <ng-content>
    </select>`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveInputComponent), multi: true } ]
})
export class ReactiveInputComponent extends ReactiveBaseComponent {

  constructor( protected ref: ChangeDetectorRef ) { 
    super( ref );
  }
}

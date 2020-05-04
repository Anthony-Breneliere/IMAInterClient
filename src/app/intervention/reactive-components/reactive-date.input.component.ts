import { Component, forwardRef, ChangeDetectorRef, Input, Output, EventEmitter, ElementRef, LOCALE_ID, Inject, ViewChild } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'

declare var $: any;

@Component(
{
  selector: 'reactive-date-input',
  template: `
    <date-input
      [changeFromModel]="isThirdParty"
      [(ngModel)]="value"
      [minDateRequired]="minDateRequired"
      [maxDateRequired]="maxDateRequired"
      [format]='format'
      [startView]='startView'
      [minView]='minView' >
    </date-input>
`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveDateInputComponent), multi: true } ]
})
export class ReactiveDateInputComponent extends ReactiveBaseComponent {

  @Input() minDateRequired : Date;
  @Input() maxDateRequired : Date;
  @Input() startView : string ='hour';
  @Input() minView : string ='minute';
  @Input() format : string ='DD/MM/YYYY HH:mm:ss';

  constructor(
    protected ref: ChangeDetectorRef )
  {
    super( ref );
  }

}

import { Component, forwardRef, ChangeDetectorRef, Input, Output, EventEmitter, ElementRef, LOCALE_ID, Inject } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'
import { formatDate } from '@angular/common'
import { DateButton } from 'angular-bootstrap-datetimepicker';
import * as _moment from 'moment';
import {unitOfTime} from 'moment';


let moment = _moment;

if ('default' in _moment) {
  moment = _moment['default'];
}

declare var $: any;

// <![[ <input  [(ngModel)]="value" (blur)="commit()" (keyup.enter)="commit()" />
// [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" class="cellinput"
// <button class="btn btn-outline-secondary dropdown-toggle date-dropdown"
// type="button"
// data-toggle="dropdown"
// aria-haspopup="true" aria-expanded="false">
// <i class="oi oi-calendar"></i>
// </button>

/**
 *
 */
@Component(
{
  selector: 'reactive-date-input',
  template: `
<input
  class="cellinput dropdown-toggle date-dropdown"
  [class.transition_1s]="!isThirdParty"
  [class.borderhalo]="isThirdParty"
  data-toggle="dropdown"
  aria-label="Date"
  aria-haspopup="true"
  aria-expanded="false"
  required readonly
  dlDateTimeInput [(ngModel)]="value" />
<div >
  <div class="dropdown-menu" (click)="keepDropDownOpen($event)">
    <div style="width:360px;">
      <dl-date-time-picker
        startView="hour"
        minView="minute"
        minuteStep="1"
        [(ngModel)]="dateValue"
        (change)="dateSelected($event)"
        [selectFilter]="datePickerFilter">
      </dl-date-time-picker>
    </div>
  </div>
</div>
`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveDateInputComponent), multi: true } ]
})
export class ReactiveDateInputComponent extends ReactiveBaseComponent {

  @Input() format: string;
  @Output() dateOutput: EventEmitter<Date> = new EventEmitter();

  constructor(
    protected ref: ChangeDetectorRef,
    private _elementRef: ElementRef,
    @Inject(LOCALE_ID) public locale: string )
  {
    super( ref );

    moment.locale( locale );

    // format par défaut du affiché
    this.format = 'DD/MM/YYYY HH:mm:ss'
  }

  private _isPickerOpen = false;
  private _datePickerDate = null;

  ngAfterViewInit(): void {
    const dropdownToggle = $('[data-toggle="dropdown"]', this._elementRef.nativeElement);
    dropdownToggle.parent().on('show.bs.dropdown', () => {
      this._isPickerOpen = true;
    });
    dropdownToggle.parent().on('hide.bs.dropdown', () => {
      this._isPickerOpen = false;
    });
  }

  dateInputFilter = (value: (number | null)) => {
    return true;
  }

  datePickerFilter = (dateButton: DateButton, viewName: string) => {
    return  true;
  }

  /*
   * Convertit la saisie en un date validee
   */
  set dateValue( newDateSelected: Date )
  {
    if ( newDateSelected && newDateSelected != this._datePickerDate)
    {
      this._datePickerDate = newDateSelected;

      this.value = moment(newDateSelected).format( this.format );
    }
  }

  get dateValue() : Date
  {
    if ( ! this.value )
      return null;

    return this._datePickerDate;
  }

  /**
   *
   * @param valueFromModel Changement depuis le modèle
   */
  writeValue(valueFromModel: string): void
  {
    if ( !valueFromModel )
      this.dateValue = null;

    else
    {
      let formattedValue = moment(valueFromModel).format( this.format );

      // on compare les valeurs pour voir s'il y a réellement un changement
      if ( this.value != formattedValue )
      {
        this.dateValue = moment( valueFromModel ).toDate();
        this.value = formattedValue;

        this.updatingState = 'otherWriting';

        window.setTimeout( () => {
          this.updatingState = null;
          this._ref.detectChanges();
        }, 100 );

        // model value has change so changes must be detected (case ChangeDetectorStrategy is OnPush)
        this._ref.detectChanges();
      }
    }
  }

  // change from the UI
  set value( formattedDate: string )
  {
    this._value = formattedDate;
    this.propagateChange( formattedDate );
    this.updatingState = null;
  }

  get value()
  {
    return this._value;
  }

  /**
   * Used to keep the Bootstrap drop-down open while clicking on the date/time picker.
   *
   * Without this, the dropdown will close whenever the user clicks,
   * @param event
   *  the DOM click event.
   */

  keepDropDownOpen(event: Event) {
    event.stopPropagation();
  }

  /**
   * Close the Date drop-down when date is selected.
   *
   * Do not `toggle` the drop-down unless a value is selected.
   *
   * ngModel handles actually setting the start date value.
   *
   * @param event
   *  the `DlDateTimePickerChange` event.
   */

  dateSelected(event) {
    console.log('_isDropdownVisible', this._isPickerOpen);
    if (this._isPickerOpen && event.value) {
      $('.date-dropdown').dropdown('toggle');
    }
  }

}

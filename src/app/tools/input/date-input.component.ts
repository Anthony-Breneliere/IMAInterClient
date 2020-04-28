import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, forwardRef, LOCALE_ID, Inject, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor  } from '@angular/forms';
import { DateButton } from 'angular-bootstrap-datetimepicker';
import * as _moment from 'moment';
import {unitOfTime} from 'moment';


let moment = _moment;

if ('default' in _moment) {
  moment = _moment['default'];
}

declare var $: any;

export const DATAINPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateInputComponent),
  multi: true
};

/**
 *
 */
@Component(
{
  moduleId: module.id,
  selector: 'date-input',
  template: `
<div class="eventReceiver dropdown">
  <input
    class="dateInput cellinput date-dropdown"
    data-toggle="dropdown"
    aria-label="Date"
    aria-haspopup="true"
    aria-expanded="false"
    required
    [disabled]="disabled"
    [class.transition_1s]="!changeFromModel"
    [class.borderhalo]="changeFromModel"
    dlDateTimeInput [ngModel]="formattedValue" />
  <div class="dropdown-menu" (click)="keepDropDownOpen($event)">
    <div style="width:{{width}};">
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
  styleUrls: [ './date-input.component.css' ],
  providers: [ DATAINPUT_CONTROL_VALUE_ACCESSOR ]
})
export class DateInputComponent implements ControlValueAccessor {

  protected _value : string = '';

  format: string = 'DD/MM/YYYY HH:mm:ss';

  @Input() changeFromModel : boolean;
  @Input() disabled : boolean;
  @Input() width : string = "360px";
  @Input() minDateRequired : Date;

  constructor(
    private _elementRef: ElementRef,
    protected _ref: ChangeDetectorRef,
    @Inject(LOCALE_ID) public locale: string )
  {
    moment.locale( locale );
  }

  private _isPickerOpen = false;
  private _datePickerDate = null;

  ngAfterViewInit(): void {

    const dropdownToggle = $('.eventReceiver', this._elementRef.nativeElement);
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
    if(this.minDateRequired != null) {
      return dateButton.value >= moment(this.minDateRequired).startOf(viewName as unitOfTime.StartOf).valueOf();
    }
    return  true;
  }

   /**
   * @param valueFromModel Changement depuis le modèle
   */
  public writeValue(valueFromModel: string): void
  {
      if ( valueFromModel )
      {
        let momentValue = moment( valueFromModel );
        this._datePickerDate = momentValue.toDate();
        this._value = valueFromModel;
      }
      else
        this.dateValue = this._value = null;

      // model value has change so changes must be detected (case ChangeDetectorStrategy is OnPush)
      this._ref.detectChanges();
  }

  /*
   * Convertit la saisie en un date validee
   */
  set dateValue( newDateSelected: Date )
  {
    if ( newDateSelected && newDateSelected != this._datePickerDate)
    {
      this._datePickerDate = newDateSelected;

      this.value = moment(newDateSelected).toISOString(true);
    }
  }

  get dateValue() : Date
  {
    return this._datePickerDate;
  }


  get formattedValue() : string
  {
    let formatted = this.value ? moment( this.value ).format( this.format ) : '';
    return formatted;
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
      $('.dateInput', this._elementRef.nativeElement).dropdown('toggle');
    }
  }

  // stores the action in the attribute (onModelChange) in the html template:
  propagateChange:any = ( change ) => {};

  // change from the UI
  @Input() set value(event: any)
  {
    let change : boolean = (this._value != event);
    if ( change )
    {
      this._value = event;
      this.propagateChange(event);
    }
  }

  get value()
  {
    return this._value;
  }

  registerOnChange(fn: any): void { this.propagateChange = fn; }

  registerOnTouched(fn: () => void): void {}


}

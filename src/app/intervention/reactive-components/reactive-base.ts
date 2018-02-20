import { Component, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';

export class ReactiveBaseComponent implements ControlValueAccessor {

  public updatingState : string = null;
  _value = '';

  get isThirdParty() : boolean
  {
    return this.updatingState == "otherWriting";
  }

  // stores the action in the attribute (onModelChange) in the html template:
  propagateChange:any = ( change ) => {};

  constructor( protected _ref: ChangeDetectorRef ) { }

  // change from the model
  writeValue(value: any): void
  {
    this._value = value; 
    this.updatingState = 'otherWriting';

    window.setTimeout( () => {
      this.updatingState = null;
      this._ref.detectChanges();
    }, 100 );

    // model value has change so changes must be detected (case ChangeDetectorStrategy is OnPush)
    this._ref.detectChanges();
  }
  
  // change from the UI
  set value(event: any)
  {
    this._value = event;
    this.propagateChange(event);
    this.updatingState = null;
  }

  get value()
  {
    return this._value;
  }

  registerOnChange(fn: any): void { this.propagateChange = fn; }
  registerOnTouched(fn: () => void): void {}
  setDisabledState?(isDisabled: boolean): void {};
}

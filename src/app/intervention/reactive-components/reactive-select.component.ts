import { Component, forwardRef, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { SelectControlValueAccessor, ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { ReactiveBaseComponent } from './reactive-base'

@Component(
{
  selector: 'reactive-select',
  template: `
  <select
    [class.transition_1s]="!isThirdParty"
    [class.borderhalo]="isThirdParty"
    [(ngModel)]="value" >

    <ng-content></ng-content>

  </select>`,
  styleUrls: [ './reactive-base.css' ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveSelectComponent), multi: true }

   ]
})
export class ReactiveSelectComponent extends SelectControlValueAccessor
{

  public updatingState : string = null;
  _value = '';

  get isThirdParty() : boolean
  {
    return this.updatingState == "otherWriting";
  }

  // stores the action in the attribute (onModelChange) in the html template:
  propagateChange:any = ( change ) => {};

  // readonly properties;
  constructor( private _cdRef: ChangeDetectorRef, _renderer: Renderer2, _elementRef: ElementRef )
  {
    super( _renderer, _elementRef );
    // super(
    //   <any>{
    //     setProperty(_, property, value) {
    //       this.properties = this.properties || {};
    //       this.properties[property] = value;
    //     }
    //   },
    //   null
    // );
    // this.properties = this.properties || {};
  }

  // change from the model
  writeValue(value: any): void
  {
    if ( this._value != value )
    {
      this._value = value;
      this.updatingState = 'otherWriting';

      window.setTimeout( () => {
        this.updatingState = null;
        this._cdRef.detectChanges();
      }, 100 );

      // model value has change so changes must be detected (case ChangeDetectorStrategy is OnPush)
      this._cdRef.detectChanges();
    }

  }

  // change from the UI
  set value(event: any)
  {
    let change : boolean = (this._value != event);
    if ( change )
    {
      this._value = event;
      this.propagateChange(event);
    }

    this.updatingState = null;
  }

  get value()
  {
    return this._value;
  }

  registerOnChange(fn: any): void { this.propagateChange = fn; }

  registerOnTouched(fn: () => void): void {}

  setDisabledState(isDisabled: boolean): void {};
}

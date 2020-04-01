import { Component, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';


/**
 * Cette classe permet au composant de détecter les changements sur la valeur
 * par un autre utilisateur.
 * Elle gère un état this.updatingState qui est fixé à 'otherWriting' dans le cas
 * où un changement venu d'ailleurs s'est produit dans les 100 dernières ms.
 */
export class ReactiveBaseComponent implements ControlValueAccessor
{

  protected _value : any = null;

  // stores the action in the attribute (onModelChange) in the html template:
  propagateChange:any = ( change ) => {};

  constructor( protected _ref: ChangeDetectorRef )
  {

  }

  // gestion de l'affichage des changements par des tierses personnes:
  public updatingState : string = null;

  get isThirdParty() : boolean
  {
    return this.updatingState == "otherWriting";
  }

  // change from the model
  writeValue(value: any): void
  {
    // on compare les valeurs pour voir s'il y a réellement un changement
    if ( this._value != value )
    {
      this.updatingState = 'otherWriting';

      window.setTimeout( () => {
        this.updatingState = null;
        this._ref.detectChanges();
      }, 100 );

      // model value has change so changes must be detected (case ChangeDetectorStrategy is OnPush)
      this._ref.detectChanges();
    }

    this._value = value;
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

  setDisabledState?(isDisabled: boolean): void {};
}

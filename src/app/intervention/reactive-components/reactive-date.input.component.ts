import { Component, forwardRef, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR  } from '@angular/forms';
import { ReactiveBaseComponent } from './reactive-base'
import { formatDate } from '@angular/common'

@Component(
{
  selector: 'reactive-date-input',
  template: `<input [class.transition_1s]="!isThirdParty" [class.borderhalo]="isThirdParty" class="cellinput" [(ngModel)]="value" (blur)="commit()" (keyup.enter)="commit()" />`,
  styleUrls: [ './reactive-base.css' ],
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveDateInputComponent), multi: true } ]
})
export class ReactiveDateInputComponent extends ReactiveBaseComponent {

  @Input() format: string;
  @Output() dateOutput: EventEmitter<Date> = new EventEmitter();

  constructor( protected ref: ChangeDetectorRef ) { 
    super( ref );
  }

  private _validatedDate : Date;

  // convertit la saisie en un date validee
  private set ValidatedDate( value: string )
  {
    if ( ! value )
      this._validatedDate = null;
    else
      {
        try 
        {
          this._validatedDate = new Date( value );
        }
        catch {}
      }
  }

  private get ValidatedDate() : string
  {
    if ( this._validatedDate )
    {
      var formated = formatDate( this._validatedDate, this.format || 'short', 'fr' );
      return formated;
    }
    else
    {
      return null;
    }
  }


  commit()
  {
    this.ValidatedDate = this._value;

    this.dateOutput.emit( this._validatedDate );
  }

  // change from the model
  writeValue(value: any): void
  {
    // plus de date valide
    this.ValidatedDate = null;

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

    this.ValidatedDate = this._value = value;
  }

  // change from the UI
  set value(event: any)
  {
    // plus de date valide, il faudra valider pour commiter la date
    this.ValidatedDate = null;

    this._value = event;
    this.propagateChange(event);
    this.updatingState = null;
  }

  get value()
  {
    return this.ValidatedDate || this._value;
  }

}
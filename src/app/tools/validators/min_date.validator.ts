import { ValidatorFn, AbstractControl } from '@angular/forms';
import * as _moment from 'moment';

let moment = _moment;

if ('default' in _moment) {
  moment = _moment['default'];
}

export function minimumDateRequired( minDateRequired = "" ): ValidatorFn
{
  return function validate (formControl: AbstractControl) : {[key: string]: any} | null
  {
    let inputDate = moment( formControl.value );

    // date invalide, on ne valide pas
    if ( ! inputDate.isValid() )
      return { inputDateInvalid: formControl.value };

    let minDate = moment( minDateRequired );

    if ( ! minDate.isValid() )
      return { minDateInvalid: formControl.value };

    // date valide et supérieure à minDate, on valide
    if (inputDate < minDate )
      return { minDateNotSatisfied: true };

    // sinon on valide
    return null;
  }

}

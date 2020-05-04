import { Directive, Input } from "@angular/core";
import { Validator, NG_VALIDATORS, AbstractControl } from "@angular/forms";
import { dateRequired } from "./date.validator";

/**
 * Sur un <input> contenant une date, on peut préciser une date minimale requise
 */
@Directive({
  selector: '[maxDateRequired]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaximumDateRequiredDirective, multi: true}]
})
export class MaximumDateRequiredDirective implements Validator
{
  @Input('maxDateRequired') maxDateRequired: string;

  validate(control: AbstractControl): {[key: string]: any} | null
  {
    return this.maxDateRequired ? dateRequired( this.maxDateRequired, 'maxDate' ) ( control ) : null;
  }
}

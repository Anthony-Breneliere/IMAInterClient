import { Directive, Input } from "@angular/core";
import { Validator, NG_VALIDATORS, AbstractControl } from "@angular/forms";
import { dateRequired } from "./date.validator";

/**
 * Sur un <input> contenant une date, on peut préciser une date minimale requise
 */
@Directive({
  selector: '[minDateRequired]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinimumDateRequiredDirective, multi: true}]
})
export class MinimumDateRequiredDirective implements Validator
{
  @Input('minDateRequired') minDateRequired: string;

  validate(control: AbstractControl): {[key: string]: any} | null
  {
    return this.minDateRequired ? dateRequired( this.minDateRequired, 'minDate' ) ( control ) : null;
  }
}

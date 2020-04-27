import { Directive, Input } from "@angular/core";
import { Validator, NG_VALIDATORS, AbstractControl } from "@angular/forms";
import { minimumCheckedValidator } from "./multiple_checkbox_validator";

/**
 * Sur un groupe de formulaire contenant uniquement des cases à cocher,
 * la directive contrôle qu'au moins une case est cochée
 */
@Directive({
  selector: '[minimumCheckedRequired]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinimumCheckedRequiredDirective, multi: true}]
})
export class MinimumCheckedRequiredDirective implements Validator {

  @Input('minimumCheckedRequired') minimumCheckedRequired: string;

  validate(control: AbstractControl): {[key: string]: any} | null {

    return this.minimumCheckedRequired ? minimumCheckedValidator( parseInt( this.minimumCheckedRequired ) ) ( control ) : null;
  }
}

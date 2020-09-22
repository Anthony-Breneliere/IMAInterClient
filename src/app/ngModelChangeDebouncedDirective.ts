import {NgModel} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, skip} from 'rxjs/operators';
import {Directive, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';

//(ngModelChange)="searchInterventions()" >

/**
 * Cette directive permet d'attendre 500 millisecondes avant de valider les modifications apportées
 * Cela permet notamment de temporiser dans le cas du lancement d'une action après une modification utilisateur 
 * et ainsi éviter de lancer plusieurs actions à tort (ex: déclenchement d'une recherche alors que l'utilisateur est encore en train d'écrire)
 * 
 * Elle peut s'appliquer à tous les éléments utilisant le ngModel, par exemple les éléments input,select,etc.
 * 
 * Cette directive s'utilise de la meme manière que le ngModelChange : 
 * On peut donc remplacer ça : 
 * <input #searchInput [(ngModel)]="Search.FreeQuery" (ngModelChange)="searchInterventions()" />
 * par ce qui suit,si l'on souhaite attendre 500 ms avant d'appeler la recherche d'interventions :
 * <input #searchInput [(ngModel)]="Search.FreeQuery" (ngModelChangeDebounced)="searchInterventions()" />
 */
@Directive({
  selector: '[ngModelChangeDebounced]',
})
export class NgModelChangeDebouncedDirective implements OnDestroy {
  @Output()
  ngModelChangeDebounced = new EventEmitter<any>();
  @Input()
  ngModelChangeDebounceTime = 500; // optional, 500 default

  subscription: Subscription;
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private ngModel: NgModel) {
    this.subscription = this.ngModel.control.valueChanges.pipe(
      skip(1), // skip initial value
      distinctUntilChanged(),
      debounceTime(this.ngModelChangeDebounceTime)
    ).subscribe((value) => this.ngModelChangeDebounced.emit(value));
  }
}
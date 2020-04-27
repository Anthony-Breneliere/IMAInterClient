import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';

import { Intervention } from '../../model/intervention';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'group-filter',
  template: `
  <label>Filtre</label>
  <select id="filterType" [(ngModel)]="TypeChoice" (change)="UpdateType" >
      <option [ngValue]="null"></option>
      <option *ngFor="let operator of AllTypeChoices">{{operator}}</option>
  </select>
  =
  <select id="filterValue" [(ngModel)]="ChosenValue" >
      <option [ngValue]="null"></option>
      <option *ngFor="let client of AllChoices">{{client}}</option>
  </select>
  `,
  styleUrls:  ['./groupFilter.scss']
})
export class GroupFilter implements OnChanges, OnInit
{
  @Output() update = new EventEmitter();

  @Input() UnfilteredInterventions : Intervention[];

  private _loadedChoices = {}

  public _typeChoice : string = "";
  public get TypeChoice() : string { return this._typeChoice; }
  public set TypeChoice( value : string )
  {
    this._typeChoice = value;
    this._chosenValue = "";
    this._allChoices = this._loadedChoices[value];
  }

  public _allTypeChoices : string[] = []
  public get AllTypeChoices() : string[] { return this._allTypeChoices; }
  @Input() public set AllTypeChoices( value : string[] )
  {
    this._allTypeChoices = value
  }

  public _chosenValue : string = "";
  public get ChosenValue() : string { return this._chosenValue; }
  public set ChosenValue( value : string )
  {
     this._chosenValue = value;
     this.update.emit();
  }

  public _allChoices : string[] = [];
  public get AllChoices() : string[] { return this._allChoices; }

  public UpdateType()
  {
    this._chosenValue = "";
  }

  private paramsSubscription : Subscription;
  private queryParamsSubscription : Subscription;

  constructor( private route: ActivatedRoute )
  {

  }

  ngOnInit()
  {
    this.paramsSubscription = this.route.queryParams.subscribe( params =>
    {
      let contrat : string = params['contrat'];

      if ( contrat && contrat.length > 3 )
      {
        this.TypeChoice = "Contrat";
        this.ChosenValue = contrat;
      }
    } );
  }

  private _interventionCount : number = 0;


  ngOnChanges()
  {
    if ( this._interventionCount != this.UnfilteredInterventions?.length )
    {
      this._interventionCount = this.UnfilteredInterventions?.length;
      this.InitFilterChoices();
    }
  }

  public get FilteredInterventions(): Intervention[]
  {
    let filteredInters = this.UnfilteredInterventions.filter(
      (i: Intervention) => {
        return ! this.TypeChoice
          || ! this.ChosenValue
          || ( this.TypeChoice == "Operateur" && this._chosenValue == i.Operateur )
          || ( this.TypeChoice == "Client" && this._chosenValue == i.NomComplet )
          || ( this.TypeChoice == "Intervenant" && this._chosenValue == i.Intervenant.Nom )
          || ( this.TypeChoice == "Contrat" && this._chosenValue == i.Site.Contrat );
       }
    )
    return filteredInters;
  }

  private InitFilterChoices()
  {
    this._loadedChoices["Operateur"] = this.getDistinctChoices( this.UnfilteredInterventions, (i : Intervention) => i.Operateur );
    this._loadedChoices["Client"] = this.getDistinctChoices( this.UnfilteredInterventions, (i : Intervention) => i.NomComplet );
    this._loadedChoices["Intervenant"] = this.getDistinctChoices( this.UnfilteredInterventions, (i : Intervention) => i.Intervenant.Nom );
    this._loadedChoices["Contrat"] = this.getDistinctChoices( this.UnfilteredInterventions, (i : Intervention) => i.Site.Contrat );

    console.log( "Loaded choices initialized with " + this.UnfilteredInterventions.length + " interventions.");
  }

  // todo ABR: voir dans une prochane version de type script si on peut typer la fonction mappingFunc
  private getDistinctChoices( inters: Intervention[], mappingFunc : any )
  {
    return inters.map( mappingFunc ).reduce( (unique : string[], item: string) => unique.includes(item) ? unique : [...unique, item], [] );
  }

}

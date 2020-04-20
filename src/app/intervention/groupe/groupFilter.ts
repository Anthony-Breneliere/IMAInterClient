import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { Intervention } from '../../model/intervention';

@Component({
  selector: 'group-filter',
  template: `
  <label>Filtre</label>
  <select id="filterType" [(ngModel)]="TypeChoice" >
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
export class GroupFilter
{
  @Output() update = new EventEmitter();

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


  // public AllOperatorChoices : string[] = [];
  // public AllClientChoices : string[] = [];
  // public AllIntervenantChoices : string[] = [];

  // public _selectedOperator : string = "";
  // public get SelectedOperator() : string { return this._selectedOperator; }
  // public set SelectedOperator( value : string ) {
  //   this._selectedOperator = value;
  //   this._selectedClient = "";
  //   this._selectedIntervenant = "";
  //   this.OnFilterUpdate(); }

  // public _selectedClient : string = "";
  // public get SelectedClient() : string { return this._selectedClient; }
  // public set SelectedClient( value : string ) {
  //   this._selectedOperator = "";
  //   this._selectedClient = value;
  //   this._selectedIntervenant = "";
  //   this.OnFilterUpdate();
  // }

  // public _selectedIntervenant : string = "";
  // public get SelectedIntervenant() : string { return this._selectedIntervenant; }
  // public set SelectedIntervenant( value : string ) {
  //   this._selectedOperator = "";
  //   this._selectedClient = "";
  //   this._selectedIntervenant = value;
  //   this.OnFilterUpdate();
  // }

  public FilterInterventions( inters: Intervention[] ): Intervention[]
  {
    let filteredInters = inters.filter(
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

  public InitFilterChoices( interventions: Intervention[] )
  {
    this._loadedChoices["Operateur"] = this.getDistinctChoices( interventions, (i : Intervention) => i.Operateur );
    this._loadedChoices["Client"] = this.getDistinctChoices( interventions, (i : Intervention) => i.NomComplet );
    this._loadedChoices["Intervenant"] = this.getDistinctChoices( interventions, (i : Intervention) => i.Intervenant.Nom );
    this._loadedChoices["Contrat"] = this.getDistinctChoices( interventions, (i : Intervention) => i.Site.Contrat );

    console.log( "Loaded choices initialized with " + interventions.length + " interventions.");
  }

  // todo ABR: voir dans une prochane version de type script si on peut typer la fonction mappingFunc
  private getDistinctChoices( inters: Intervention[], mappingFunc : any )
  {
    return inters.map( mappingFunc ).reduce( (unique : string[], item: string) => unique.includes(item) ? unique : [...unique, item], [] );
  }

}

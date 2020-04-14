/**
 * Created by abreneli on 04/07/2016.
 */

import { Component,  Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { SortInterventionByDateTime } from './sortInterPipe';
import { Subscription } from 'rxjs';
import { filter, delay } from 'rxjs/operators';
import { Message } from '../../model/message';
import { ConnectionStatus } from '../../services/connection.status';
import { Etat } from "../../model/enums";
import { SearchQuery } from 'app/services/searchQuery';

export enum GroupTypeEnum
{
    mesInterventions,
    autresInterventions,
    interventionsCloses
}

@Component({
    moduleId: module.id,
    selector: 'intervention-group',
    templateUrl: './intervention.group.html',
    styleUrls:  ['./intervention.group.scss']
})

export class InterventionGroup  {

    @Input() public GroupName: string;
    @Input() public GroupType: GroupTypeEnum;
    @Input() public SelectedIntervention: Intervention;
    @Input() public Expanded: boolean;
    @Output() onSelectedButton = new EventEmitter<InterventionButton>();

    public Search : SearchQuery = new SearchQuery();

    private isMyInters : boolean = false;

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    private _groupInterventions : Intervention[] = [];

    private _currentlyUpdatedInters : number[] = [];

    public CurrentInterOperators : string[] = [];
    public CurrentInterClients : string[] = [];
    public CurrentIntervenants : string[] = [];

    public _selectedOperator : string = "";
    public get SelectedOperator() : string { return this._selectedOperator; }
    public set SelectedOperator( value : string ) {
      this._selectedOperator = value;
      this._selectedClient = "";
      this._selectedIntervenant = "";
      this.updateGroupInterventions(); }

    public _selectedClient : string = "";
    public get SelectedClient() : string { return this._selectedClient; }
    public set SelectedClient( value : string ) {
      this._selectedOperator = "";
      this._selectedClient = value;
      this._selectedIntervenant = "";
      this.updateGroupInterventions();
    }

    public _selectedIntervenant : string = "";
    public get SelectedIntervenant() : string { return this._selectedIntervenant; }
    public set SelectedIntervenant( value : string ) {
      this._selectedOperator = "";
      this._selectedClient = "";
      this._selectedIntervenant = value;
      this.updateGroupInterventions();
    }


    interventionChangeSubscription : Subscription;
    interventionMessageSubscription : Subscription;

    public get groupInterventions(): Intervention[]
    {
        return this._groupInterventions;
    }

    constructor( private interService : InterventionService, private _connectionStatus : ConnectionStatus, protected _cdref: ChangeDetectorRef )
    {

    }

    ngOnInit()
    {
        // on inscrit le composant à la détection des changements d'interventions
        // cela permet (entre autres) d'afficher un petit halo sur le bouton quand une intervention a changé
        this.interventionChangeSubscription =
            this.interService.newInterData$.pipe( delay(1000) ).subscribe( inter =>  {

                // à chaque fois qu'on reçoit des datas sur les interventions avec les infos d'opérateur,
                // on met à jour la liste des interventions du groupe,
                // car une nouvelle intervention a pu arriver, ou bien un intervention a pu se fermer, changer d'opérateur, etc..
               if ( inter.Operateur != null )
                this.updateGroupInterventions();

            } );

            this.interService.newInterData$.subscribe( inter =>  {
                 this.interventionChangeHighlight( inter.Id );
            } );

        this.interventionMessageSubscription = this.interService.newMessages$
            .subscribe( notif  => {
                this.interventionChangeHighlight( notif["0"].Id );
            } );

        // initialise la liste des interventions
        this.updateGroupInterventions();
    }


    ngOnDestroy()
    {
        // avant la destruction on veille à se désinscrire le composant aux changements d'intervention
        // ou sinon ChangeDetectorRef.detectChanges() plante
        this.interventionChangeSubscription.unsubscribe();

        // désinscription aux messages
        this.interventionMessageSubscription.unsubscribe();
    }

    public interventionChangeHighlight( interId : number )
    {
        this._currentlyUpdatedInters.push( interId );
      //  this._ref.detectChanges();

    //    console.log("Detection changement inter " + inter.Id + " liste totale: " + this._currentlyUpdatedInters );

        window.setTimeout( () => {
            let index = this._currentlyUpdatedInters.indexOf( interId );
            this._currentlyUpdatedInters.splice( index, 1 );
            this._cdref.detectChanges();
        }, 500 );
    }



    /* on met à jour les interventions du groupe */
    private updateGroupInterventions() : void
    {
        switch( this.GroupType )
        {
            case GroupTypeEnum.interventionsCloses:
                this._groupInterventions = this.CloseInterventions;
                break;

            case GroupTypeEnum.autresInterventions:
                this._groupInterventions = this.OtherInterventions;
                break;

            default:
                this._groupInterventions =  this.MyInterventions;
                this.isMyInters = true;
        };

        this._cdref.detectChanges();
    }

    public get MyInterventions(): Intervention[]
    {
        let currentInterventions = this.interService.getLoadedInterventions();

        let interList = currentInterventions.filter(
            (i: Intervention) => { return this._connectionStatus.operatorNameEqual( i.Operateur ) &&
                ( i.Etat != Etat.Close && i.Etat != Etat.Annulee) } );

        return interList;
    }


    public get OtherInterventions(): Intervention[]
    {
        let otherInterventions = this.interService.getLoadedInterventions().filter(
            (i: Intervention) => { return (! i.Operateur || !this._connectionStatus.operatorNameEqual( i.Operateur )) && i.Etat != Etat.Close && i.Etat != Etat.Annulee } );

        this.CurrentInterOperators = otherInterventions.map( i => i.Operateur ).reduce( (unique, item) => unique.includes(item) ? unique : [...unique, item], [] );
        this.CurrentInterClients = otherInterventions.map( i => i.NomComplet ).reduce( (unique, item) => unique.includes(item) ? unique : [...unique, item], [] );
        this.CurrentIntervenants = otherInterventions.map( i => i.Intervenant.Nom ).reduce( (unique, item) => unique.includes(item) ? unique : [...unique, item], [] );

        let filteredOtherInterventions = otherInterventions.filter(
          (i: Intervention) => {
            return (  !this.SelectedClient || this.SelectedClient == i.NomComplet )
              && (  !this.SelectedOperator || this.SelectedOperator == i.Operateur )
              && (  !this.SelectedIntervenant || this.SelectedIntervenant == i.Intervenant.Nom );
          }
        )
        return filteredOtherInterventions;
    }

    public get CloseInterventions(): Intervention[]
    {
        let closed = this.interService.getLoadedInterventions().filter(
            (i: Intervention) => { return i.Etat == Etat.Close || i.Etat == Etat.Annulee } );
        return closed;
    }

    isCurrentlyUpdated( interId : number ) : boolean
    {
        if ( this._currentlyUpdatedInters )
            return this._currentlyUpdatedInters.indexOf( interId ) != -1;

        return false;
    }

    public onClickHeader() : void
    {
        this.Expanded = ! this.Expanded;
    }

    onSelected(newSelectedButton: InterventionButton)
    {
        // on relaie le bouton sélectionné au composant parent:
        this.onSelectedButton.emit( newSelectedButton );

    }

    searchInterventions(  )
    {
      let query = this.Search;

      // on recherche les interventions à partir de 4 caractères saisis
      if ( query )
      {
        var acceptableQuery = (query.FreeQuery && query.FreeQuery.length) > 3
          || query.StartDate != null
          || query.TypeIntervention;

        if( acceptableQuery )
        {
          // on vide les interventions du groupe
          this._groupInterventions = [];

          this.interService.searchInterventions( this.Search );
        }
      }

    }

    addNewIntervention()
    {
        this.interService.addNewIntervention();
    }

    public get readOnly()
    {
        return ! this._connectionStatus.connected

    }
}

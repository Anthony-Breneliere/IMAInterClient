/**
 * Created by abreneli on 04/07/2016.
 */

import { Component,  Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { SortInterventionByDateTime } from './sortInterPipe';
import { GroupFilter } from './groupFilter';
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

export class InterventionGroup implements AfterContentChecked
{

    @Input() public GroupName: string;
    @Input() public GroupType: GroupTypeEnum;
    @Input() public SelectedIntervention: Intervention;
    @Input() public Expanded: boolean;
    @Output() onSelectedButton = new EventEmitter<InterventionButton>();

    @ViewChild('filterOthers', {static: false}) set filterOthers( createdFilter: GroupFilter )
    {
      // cas d'un ViewChild sur élément dans ngIf: https://stackoverflow.com/questions/39366981/viewchild-in-ngif
      // il faut l'initialiser au moment où on l'affiche
      if ( createdFilter && this._filterOthers != createdFilter )
      {
        if ( createdFilter )
          createdFilter.InitFilterChoices( this.UnfilteredOtherInterventions );

        this._filterOthers = createdFilter;
      }
    }

    @ViewChild('filterMine', {static: false}) set filterMine( createdFilter: GroupFilter )
    {
      // cas d'un ViewChild sur élément dans ngIf: https://stackoverflow.com/questions/39366981/viewchild-in-ngif
      // il faut l'initialiser au moment où on l'affiche
      if ( createdFilter && this._filterMine != createdFilter )
      {
        if ( createdFilter )
          createdFilter.InitFilterChoices( this.UnfilteredMyInterventions );

        this._filterMine = createdFilter;
      }
    }

    private _filterOthers: GroupFilter;
    private _filterMine: GroupFilter;

    public Search : SearchQuery = new SearchQuery();

    private isMyInters : boolean = false;

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    private _groupInterventions : Intervention[] = [];

    private _currentlyUpdatedInters : number[] = [];

    public CurrentInterOperators : string[] = []
    public CurrentInterClients : string[] = []
    public CurrentIntervenants : string[] = []

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


    ngAfterContentChecked()
    {
      if ( this.GroupType == GroupTypeEnum.autresInterventions && this.Expanded )
      {
        this._cdref.detectChanges();

        this.updateGroupInterventions();
      }
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
    public updateGroupInterventions() : void
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

    /**
     * Mes interventions en cours
     */
    public get MyInterventions(): Intervention[]
    {
        let currentInterventions = this.interService.getLoadedInterventions();

        let interList = currentInterventions.filter(
            (i: Intervention) => { return this._connectionStatus.operatorNameEqual( i.Operateur ) &&
                ( i.Etat != Etat.Close && i.Etat != Etat.Annulee) } );

        return interList;
    }


    private get UnfilteredMyInterventions(): Intervention[]
    {
      let currentInterventions = this.interService.getLoadedInterventions();

      let myInterventions = currentInterventions.filter(
        (i: Intervention) => { return this._connectionStatus.operatorNameEqual( i.Operateur ) &&
            ( i.Etat != Etat.Close && i.Etat != Etat.Annulee) } );

      return myInterventions;
    }

    /**
     * Les interventions en cours des autres
     */
    public get OtherInterventions(): Intervention[]
    {
        let otherInterventions = this.UnfilteredOtherInterventions;

        if( this._filterOthers )
          otherInterventions = this._filterOthers.FilterInterventions( otherInterventions );

        return otherInterventions;
    }

    private get UnfilteredOtherInterventions(): Intervention[]
    {
      let otherInterventions = this.interService.getLoadedInterventions().filter(
        (i: Intervention) => { return (! i.Operateur || !this._connectionStatus.operatorNameEqual( i.Operateur )) && i.Etat != Etat.Close && i.Etat != Etat.Annulee } );

      return otherInterventions;
    }


    /**
     * Les interventions closes issues de la recheche
     */
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

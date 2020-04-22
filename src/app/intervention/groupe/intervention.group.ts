/**
 * Created by abreneli on 04/07/2016.
 */

import { Component,  Input, Output, EventEmitter, ChangeDetectionStrategy,
  ViewChild, ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
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
import { ActivatedRoute, Params, Router } from '@angular/router';


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

    @ViewChild('filterOthers', {static: false}) filterOthers;
    @ViewChild('filterMine', {static: false}) filterMine;

    private paramsSubscription : Subscription;
    private queryParamsSubscription : Subscription;

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

    constructor(
      private _interService : InterventionService,
      private _connectionStatus : ConnectionStatus,
      protected _cdref: ChangeDetectorRef,
      private route: ActivatedRoute )
    {
    }

    ngOnInit()
    {
      // on inscrit le composant à la détection des changements d'interventions
      // cela permet (entre autres) d'afficher un petit halo sur le bouton quand une intervention a changé
      this.interventionChangeSubscription =

          this._interService.newInterData$.pipe( delay(1000) ).subscribe( inter =>  {

              // à chaque fois qu'on reçoit des datas sur les interventions avec les infos d'opérateur,
              // on met à jour la liste des interventions du groupe,
              // car une nouvelle intervention a pu arriver, ou bien un intervention a pu se fermer, changer d'opérateur, etc..
              if ( inter.Operateur != null )
              this.updateGroupInterventions();

          } );

          this._interService.newInterData$.subscribe( inter =>  {
                this.interventionChangeHighlight( inter.Id );
          } );

      this.interventionMessageSubscription = this._interService.newMessages$
          .subscribe( notif  => {
              this.interventionChangeHighlight( notif["0"].Id );
          } );

      // initialise la liste des interventions
      this.updateGroupInterventions();

      // gestion des url de recherche
      if ( this.route.routeConfig.path.startsWith( 'search' ) )
      {
        this.paramsSubscription = this.route.queryParams.subscribe( params =>
        {
          let contrat : string = params['contrat'];

          if( this.GroupType === GroupTypeEnum.interventionsCloses)
          {
            this.Search =
            {
              FreeQuery: contrat,
              EndDate: params['dateFin'],
              StartDate: params['dateDebut'],
              TypeIntervention:  params['typeIntervention']
            }

            this.searchInterventions();
          }

        } );
      }

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
      return this.filterMine ? this.filterMine.FilteredInterventions : this.UnfilteredMyInterventions;
    }

    filterUpdate( event: any )
    {
      this.updateGroupInterventions();
    }

    private get UnfilteredMyInterventions(): Intervention[]
    {
      let currentInterventions = this._interService.getLoadedInterventions();

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
        return this.filterOthers ? this.filterOthers.FilteredInterventions : this.UnfilteredOtherInterventions;
    }

    private get UnfilteredOtherInterventions(): Intervention[]
    {
      let otherInterventions = this._interService.getLoadedInterventions().filter(
        (i: Intervention) => { return (! i.Operateur || !this._connectionStatus.operatorNameEqual( i.Operateur )) && i.Etat != Etat.Close && i.Etat != Etat.Annulee } );

      return otherInterventions;
    }


    /**
     * Les interventions closes issues de la recheche
     */
    public get CloseInterventions(): Intervention[]
    {
        let closed = this._interService.getLoadedInterventions().filter(
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
          this._interService.searchInterventions( this.Search ).catch( reason => {
            console.log( "La recherche d'intervention a échoué " + reason + ":" );
            console.log( this.Search );
          });

        }
      }

    }

    addNewIntervention()
    {
        this._interService.addNewIntervention();
    }


    public get readOnly()
    {
        return ! this._connectionStatus.connected

    }

}

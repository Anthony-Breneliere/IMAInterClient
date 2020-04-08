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
    styleUrls:  ['./intervention.group.css']
})

export class InterventionGroup  {

    @Input() public GroupName: string;
    @Input() public GroupType: GroupTypeEnum;
    @Input() public SelectedIntervention: Intervention;
    @Input() public Expanded: boolean;
    @Output() onSelectedButton = new EventEmitter<InterventionButton>();

    private isMyInters : boolean = false;

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    private _groupInterventions : Intervention[] = [];

    private _currentlyUpdatedInters : number[] = [];

    private _currentInterOperators : string[] = []
    private _currentInterClients : string[] = []
    private _currentIntervenants : string[] = []

    interventionChangeSubscription : Subscription;
    interventionMessageSubscription : Subscription;

    public get groupInterventions(): Intervention[]
    {
        return this._groupInterventions;
    }

    constructor( private interService : InterventionService, private connStatus : ConnectionStatus, protected _ref: ChangeDetectorRef )
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
            this._ref.detectChanges();
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

        this._ref.detectChanges();
    }

    public get MyInterventions(): Intervention[]
    {
        let currentInterventions = this.interService.getLoadedInterventions();

        let interList = currentInterventions.filter(
            (i: Intervention) => { return this.connStatus.operatorNameEqual( i.Operateur ) &&
                ( i.Etat != Etat.Close && i.Etat != Etat.Annulee) } );

        return interList;
    }


    public get OtherInterventions(): Intervention[]
    {
        let otherInterventions = this.interService.getLoadedInterventions().filter(
            (i: Intervention) => { return (! i.Operateur || !this.connStatus.operatorNameEqual( i.Operateur )) && i.Etat != Etat.Close && i.Etat != Etat.Annulee } );

        this._currentInterOperators = otherInterventions.map( i => i.Operateur );
        this._currentInterClients = otherInterventions.map( i => i.NomComplet );
        this._currentIntervenants = otherInterventions.map( i => i.Intervenant.Societe );

        return otherInterventions;
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

    searchInterventions( queryString : string )
    {
        // on recherche les interventions à partir de 4 caractères saisis
        if ( queryString.length >= 4 )
        {
            // on vide les interventions du groupe
            this._groupInterventions = [];

            this.interService.searchInterventions( queryString );
        }
    }

    addNewIntervention()
    {
        this.interService.addNewIntervention();
    }
}

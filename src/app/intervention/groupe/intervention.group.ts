/**
 * Created by abreneli on 04/07/2016.
 */

import { Component,  Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { SortInterventionByDateTime } from './sortInterPipe';
import { Subscription } from 'rxjs';

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

    private _groupInterventions : Intervention[];

    private _currentlyUpdatedInters : number[] = [];

    interventionChangeSubscription : Subscription;
    
    constructor( private interService : InterventionService, protected _ref: ChangeDetectorRef )
    {
    }

    ngOnInit()
    {
        // on inscrit le composant à la détection des changements d'interventions
        // cela permet (entre autres) d'afficher un petit halo sur le bouron quand une intervention a changé
        this.interventionChangeSubscription = 
            this.interService.newInterData$.subscribe( inter => 
            {
                this._currentlyUpdatedInters.push( inter.Id );
                this._ref.detectChanges();

            //    console.log("Detection changement inter " + inter.Id + " liste totale: " + this._currentlyUpdatedInters );

                window.setTimeout( () => {
                    let index = this._currentlyUpdatedInters.indexOf( inter.Id );
                    this._currentlyUpdatedInters.splice( index, 1 );
                    this._ref.detectChanges();
                }, 500 );
            } );

        this.interService.newMessages$
            .subscribe( i => { this._ref.detectChanges(); } );
    }

    ngOnDestroy()
    {
        // avant la destruction on veille à se désinscrire le composant aux changements d'intervention  
        // ou sinon ChangeDetectorRef.detectChanges() plante
        this.interventionChangeSubscription.unsubscribe();
    }

    get groupInterventions(): Intervention[]
    {
        switch( this.GroupType )
        {
            case GroupTypeEnum.interventionsCloses:
                this._groupInterventions = this.interService.CloseInterventions;
                break;

            case GroupTypeEnum.autresInterventions:
                this._groupInterventions = this.interService.OtherInterventions;
                break;

            default:
                this._groupInterventions =  this.interService.MyInterventions;
                this.isMyInters = true;
        }

        return this._groupInterventions;
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
            this.interService.searchInterventions( queryString );
        }
    }

}
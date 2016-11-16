/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Intervention } from '../../model/intervention';
import { OrigineFiche, TypeFiche, Trajet, MotifIntervention, TypePresence, DepotBonIntervention} from '../../model/enums';
import { InterventionService } from "../intervention.service";

export class Cucu
{
    coco : string;

    Coco() : string{
        return this.coco;
    }
}

@Component({
    selector: 'intervention-details',
    templateUrl: 'app/intervention/details/intervention.details.html',
    styleUrls: ['app/intervention/details/intervention.details.css']
})


export class InterventionDetails implements  OnInit
{
    private MotifIntervention = MotifIntervention;
    private MotifInterventionValues = Object.values(MotifIntervention).filter( e => typeof( e ) == "number" );

    private Trajet = Trajet;
    private TrajetValues = Object.values(Trajet).filter( e => typeof( e ) == "number" );

    private TypePresence = TypePresence;
    private TypePresenceValues = Object.values(TypePresence).filter( e => typeof( e ) == "number" );

    private DepotBonIntervention = DepotBonIntervention;
    private DepotBonInterventionValues = Object.values(DepotBonIntervention).filter( e => typeof( e ) == "number" );

    // l'intervention est passée en paramètre du composant
    private intervention: Intervention;

    private motifChoices: any[] = [];

    // private autreMotif: boolean = false;

    private radioValue : MotifIntervention;

    constructor( private interService: InterventionService )
    {
        // on transforme l'enum MotifIntervention en une structure clé/valeur qu'on peut binder
        this.motifChoices = Object.values(MotifIntervention).filter( e => typeof( e ) == "number" );

        this.motifChoices.forEach( e =>
        {
            console.log( MotifIntervention[ e ] );
            console.log( MotifIntervention.Autre );
        });
    }

    isChecked( value : MotifIntervention ) : boolean
    {
        return this.intervention.rapport.motifIntervention == value;
    }

    ngOnInit()
    {
        this.intervention = this.interService.getIntervention();
    }

}
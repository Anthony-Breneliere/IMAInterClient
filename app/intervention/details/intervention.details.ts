import { Intervenant } from '../../model/intervenant';
import { Site } from '../../model/site';
import { Rapport } from '../../model/rapport';

/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Intervention } from '../../model/intervention';
import { OrigineFiche, TypeFiche, Trajet, MotifIntervention, TypePresence, DepotBonIntervention, Etat} from '../../model/enums';
import { InterventionService } from "../../services/intervention.service";


@Component({
    selector: 'intervention-details',
    templateUrl: 'app/intervention/details/intervention.details.html',
    styleUrls: ['app/intervention/details/intervention.details.css']
})


export class InterventionDetails implements  OnInit
{
    // l'intervention affichée est passée en paramètre du composant
    @Input() intervention: Intervention;

    private get intervenant() : Intervenant { return this.intervention.Intervenant; };
    private get site() : Site { return this.intervention.Site; };
    private get rapport() : Rapport { return this.intervention.Rapport; };

    private MotifIntervention = MotifIntervention;
    private MotifInterventionValues = Object.values(MotifIntervention).filter( e => typeof( e ) == "number" );

    private Trajet = Trajet;
    private TrajetValues = Object.values(Trajet).filter( e => typeof( e ) == "number" );

    private TypePresence = TypePresence;
    private TypePresenceValues = Object.values(TypePresence).filter( e => typeof( e ) == "number" );

    private DepotBonIntervention = DepotBonIntervention;
    private DepotBonInterventionValues = Object.values(DepotBonIntervention).filter( e => typeof( e ) == "number" );

    private motifChoices: any[] = [];

    // private autreMotif: boolean = false;

    private radioValue : MotifIntervention;

    constructor( private interService: InterventionService )
    {
        // on transforme l'enum MotifIntervention en une structure clé/valeur qu'on peut binder
        this.motifChoices = Object.values(MotifIntervention).filter( e => typeof( e ) == "number" );
    }

    isChecked( value : MotifIntervention ) : boolean
    {
        return this.intervention.Rapport.MotifIntervention == value;
    }

    ngOnInit()
    {
        // this.intervention = this.interService.getIntervention( 0 );
    }

}
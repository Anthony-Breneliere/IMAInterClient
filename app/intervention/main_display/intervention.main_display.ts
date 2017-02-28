/**
 * Created by abreneli on 04/07/2016.
 */

import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {InterventionGroup, GroupTypeEnum} from '../groupe/intervention.group';
import {Intervention} from "../../model/intervention";
import {Etat} from "../../model/enums";
import {InterventionButton} from "../button/intervention.button";
import {InterventionService} from "../../services/intervention.service";
import {ActivatedRoute, Params, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    moduleId: module.id,
    selector: 'intervention-main-display',
    templateUrl: './intervention.main_display.html',
    styleUrls:  ['./intervention.main_display.css'],
})

export class InterventionMainDisplay implements OnInit, AfterViewInit {

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    // ce composant là il SAIT quel bouton est toujours sélectionné (il ne peut y en avoir qu'un)
    private selectedButton : InterventionButton;

    private urlInterventionId : number;
    
    @ViewChild("myGroup") myGroup : InterventionGroup;
    @ViewChild("othersGroup") othersGroup : InterventionGroup;
    @ViewChild("searchGroup") searchGroup : InterventionGroup;

    constructor(
        private interventionService: InterventionService,
        private route: ActivatedRoute
    )
    {}

    ngOnInit() {

        // a l'initialisation du composant, le paramètre id de l'url est lue de manière à charger
        // puis à afficher l'intervention correspondante.
        this.route.params
            .switchMap( (params: Params) => [+params['id']] )
            .subscribe( (id) => { 
                this.urlInterventionId = id;
                if ( null != this.urlInterventionId )
                {
                    this.interventionService.loadIntervention( this.urlInterventionId )
                    .then( (inter : Intervention) => { this.selectedIntervention =  inter; this.deployGroup( inter ); } )
                    .catch( (reason : any) => { console.error( "erreur de chargement de l'intervention: " + reason ); })
                }
             } );
    }

    ngAfterViewInit() {
        // code exécuté après l'initialisation des vues @ViewChild

        console.log( "InterventionMainDisplay.ngAfterViewInit");

    }

    private _selectedIntervention : Intervention;
    get selectedIntervention() : Intervention
    {
        // si on a un bouton qui est sélectionné alors on prend l'intervention du bouton
        return this._selectedIntervention;
    }

    set selectedIntervention( value: Intervention)
    {
        this._selectedIntervention = value;
    }

    /**
     * Le groupe de l'intervention doit toujours être sélectionné
     */
    private deployGroup( inter: Intervention )
    {
        if ( inter.Etat != Etat.Close )
        {
            if ( inter.Operateur == this.interventionService.login )
                this.myGroup.expanded = true;
            else
                this.othersGroup.expanded = true;
        }
        else
        {
            this.searchGroup.expanded = true;
        }
    }

    onSelectedButton(newSelectedButton: InterventionButton)
    {
        if (  this.selectedButton != newSelectedButton)
        {
            this.selectedButton = newSelectedButton;
            this.selectedIntervention = newSelectedButton.intervention;

            // un bouton d'intervention a été cliqué, je charge l'intervention si elle n'est pas chargée
            let idSelectedI = this.selectedButton.intervention.Id;
            if ( ! this.interventionService.getInterventionState( idSelectedI ).Loaded )
            {
                // récupération de l'intervention auprès des services de sa majesté IMAInter
                this.interventionService.getIntervention( idSelectedI );
            }
        }
    }
}
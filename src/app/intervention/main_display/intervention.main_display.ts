/**
 * Created by abreneli on 04/07/2016.
 */
import { Connection } from '@angular/http';

import {Component, ViewChild, OnInit, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import {InterventionGroup, GroupTypeEnum} from '../groupe/intervention.group';
import {Intervention} from "../../model/intervention";
import {Etat} from "../../model/enums";
import {InterventionButton} from "../button/intervention.button";
import {InterventionService} from "../../services/intervention.service";
import {ConnectionStatus} from "../../services/connection.status";
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Chat } from '../chat/chat';

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

    public afficheNavigation : boolean;
    public afficheBarre : boolean = true;

    @ViewChild("myGroup") myGroup : InterventionGroup;
    @ViewChild("othersGroup") othersGroup : InterventionGroup;
    @ViewChild("searchGroup") searchGroup : InterventionGroup;

    constructor(
        private connectionStatus: ConnectionStatus,
        private interventionService: InterventionService,
        private route: ActivatedRoute,
        private router: Router,
        private cdref : ChangeDetectorRef
    )
    {}

    public flapNav()
    {
        this.afficheNavigation = ! this.afficheNavigation;

        this.router.navigate( [], { queryParams: 
            { 
                nav: this.afficheNavigation ? 1 : 0,
                bar: this.afficheBarre ? 1 : 0
            } } );
    }

    ngOnDestroy() {
        console.log("Vue InterventionMainDisplay détruite.")
    }

    ngOnInit() {

        // le changement de l'id dans la route doit charger l'intervention et déployer 
        // le groupe correspondant à l'intervention dans la barre de navigation.
        this.route.params
            .subscribe( params =>
            {
                let id : number = params['id'];
 
                this.urlInterventionId = id;
                if ( this.urlInterventionId > 0 )
                {
                    // une fois la connection établie et l'intervention id complète reçu du serveur, alors
                    // on sélectionne et affiche l'intervention
                    this.interventionService.connectAndLoadIntervention( this.urlInterventionId )
                    .then( (inter : Intervention) => { 
                        this.selectedIntervention = inter;

                        // ouverture du groupe de l'intervention
                        this.deployGroup( inter );
                    } )
                    
                    .catch( (reason : any) => { console.error( "erreur de chargement de l'intervention: " + reason ); })
                }
             } );

        this.route.queryParams
            .subscribe( queryParams =>
            {
                // délai pour l'affichage des boutons, sinon le menu contextuel ne peut être affiché
                setTimeout( () => {
                    this.afficheNavigation = queryParams['nav'] != 0;
                }, 2000 );
                
                // this.afficheNavigation = queryParams['nav'] != 0;
                this.afficheBarre = queryParams['bar'] != 0;
            } );
    }

    get chatDisplayed() : boolean
    {
        let inter = this.selectedIntervention;

        let interLancee : boolean =
            inter && inter.Etat != Etat.Creee;

        let messages : boolean =
            inter && inter.Chat && inter.Chat.length > 0;

        let chatDisplayed : boolean =
            interLancee || messages;
            
        return chatDisplayed;
    }

    get isThereIntervenant() : boolean
    {
        let inter = this.selectedIntervention;
        let isThereIntervenant : boolean = 
            inter &&  inter.Etat != Etat.Creee
            && inter.Etat != Etat.Annulee
            && inter.Etat != Etat.Close;
        return isThereIntervenant;
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
        if ( this.myGroup && this.othersGroup && inter.Etat != Etat.Close )
        {
            if ( inter.Operateur == this.connectionStatus.login )
                this.myGroup.Expanded = true;
            else
                this.othersGroup.Expanded = true;
        }
        else if ( this.searchGroup )
        {
            this.searchGroup.Expanded = true;
        }
    }

    onSelectedButton(newSelectedButton: InterventionButton)
    {
        if (  this.selectedButton != newSelectedButton)
        {
            this.selectedButton = newSelectedButton;
            this.selectedIntervention = newSelectedButton.intervention;

            // un bouton d'intervention a été cliqué, je charge l'intervention si elle n'est pas chargée
            let interSelected = this.selectedButton.intervention;

            // récupération de l'intervention auprès des services de sa majesté IMAInter
            // chargement de l'intervention complètege effectué dans le ngOnInit, on désactive celle-ci:
            // this.interventionService.getFullIntervention( interSelected.Id, interSelected.Site ? interSelected.Site.Id : null);
            this.cdref.detectChanges();
        }
    }

    onTestClick()
    {
        if ( this.connectionStatus.errorMessages )
            this.connectionStatus.addErrorMessage( "Message de test" );
        this.connectionStatus.connected = ! this.connectionStatus.connected;
    }
}
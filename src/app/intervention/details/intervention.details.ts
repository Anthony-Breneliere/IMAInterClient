import { ITypeMainCourante } from '../../model/type_maincour';
import { RapportNonAccesAuSite } from '../../model/rapport_non_acces_au_site';
import { forEach } from 'typescript-collections/dist/lib/arrays';
import { MainCourante } from '../../model/main_courante';
import { Intervenant } from '../../model/intervenant';
import { Site } from '../../model/site';
import { Rapport } from '../../model/rapport';
import { RapportTrajet } from '../../model/rapport_trajet';
import { RapportIssuesConcernees } from '../../model/rapport_issues_concernees';
import { RapportLumieresAllumees } from '../../model/rapport_lumieres';
import { RapportVerifications } from '../../model/rapport_verifications';
import {RapportPresence} from "../../model/rapport_presence";
import {Alarme} from "../../model/alarme";
import {RapportMiseEnSecurite} from '../../model/rapport_mise_en_securite';
import {RapportArriveeSurLieux} from '../../model/rapport_arrivee_sur_lieux';

import * as Lodash from 'lodash';

// import 'jquery-ui';
//import 'gridstack';

/**
 * Created by abreneli on 01/07/2016.
 */

import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ElementRef,
    Renderer,
    SimpleChanges
    
} from '@angular/core';

import { Intervention } from '../../model/intervention';
import { Section } from '../section/section';
import { ReactiveInputComponent } from '../reactive-components/reactive-input.component'
import { ReactiveCheckboxComponent } from '../reactive-components/reactive-checkbox.component'
import { Field } from '../section/field';
import { OrigineFiche, TypeFiche, Trajet, MotifIntervention, TypePresence, DepotBonIntervention, Etat, TypeSite, CircuitVerification} from '../../model/enums';
import { InterventionService } from "../../services/intervention.service";
import { Subscription } from 'rxjs/Rx';
import { Telephone } from 'app/model/telephone';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    moduleId: module.id,
    selector: 'intervention-details',
    templateUrl: './intervention.details.html',
    styleUrls: ['./intervention.details.css'
    ],

    // pour des raisons de performance, les champs ne seront mis à jour que sur un appel de onChangeCallback
    changeDetection : ChangeDetectionStrategy.OnPush
})


export class InterventionDetails implements  OnInit, OnChanges
{
    interventionChangeSubscription : Subscription;

    // l'intervention affichée est passée en paramètre du composant
    private _intervention: Intervention;


    @Input() public set intervention( value : Intervention )  {
        this._intervention = value;
        
        // le changement d'intervention doit déclncher la détection des changements
       //  this.ref.markForCheck(); commenté car génère des erreurs

        // à chaque changement d'intervention affichée le composant s'abonne aux changements de l'intervention correspondante
        if ( this.interventionChangeSubscription )
            this.interventionChangeSubscription.unsubscribe();

        this.interventionChangeSubscription = 
            this.interService.newInterData$.filter( i => this.intervention && this.intervention.Id == i.Id  ).subscribe( i => this.detectChanges() );

        // if ( this._intervention && this._intervention.Rapport )
        // {
        //     console.log( this._intervention );
        //     console.log( this._intervention.Rapport );
        //     console.log( this._intervention.Rapport.NumeroBon );
    
        //     let numeroBon : FormControl = new FormControl(this._intervention.Rapport.NumeroBon);
    
        //     this.detailForm = new FormGroup({
        //         'numeroBon': new FormControl(this._intervention.Rapport.NumeroBon)
        //         });

            
        //     numeroBon.valueChanges.subscribe( c => 
        //         {
        //             console.log( "La valeur du bon a changé:");
        //             console.log( c );
        //         }
        //     );
        // }
    }


    ngOnInit()
    {
    }

    ngOnChanges( changes: SimpleChanges )
    {
        console.log("Changements détectés sur intervention :");
        console.log( changes );
    }

    public get readOnly()
    {
        let readOnly = this._intervention.Etat == Etat.Annulee || this._intervention.Etat == Etat.Close;
        return readOnly;
    }

    public get telephonesSite() : Telephone[] { return Array.isArray( this.site.TelephonesN ) ? this.site.TelephonesN : [] } 
    public get intervention() : Intervention { return this._intervention; }
    private get rapport() : Rapport { return this.intervention.RapportN; }
    private get intervenant() : Intervenant { return this.intervention.IntervenantN; }
    private get site() : Site { return this.intervention.SiteN; }
    private get trajet() : RapportTrajet { return this.rapport.TrajetN; }
    private get presence() : RapportPresence { return this.rapport.PresenceN; }
    private get miseEnSecurite() : RapportMiseEnSecurite { return this.rapport.MiseEnSecuriteN; }
    private get verifications() : RapportVerifications { 
        return this.rapport.VerificationsN;
    }
    private get arriveeSurLieux() : RapportArriveeSurLieux { return this.rapport.ArriveeSurLieuxN; }
    private get nonAccesAuSite() : RapportNonAccesAuSite { return this.arriveeSurLieux.RapportNonAccesAuSiteN; }
    private get quellesLumieresAllumees() : RapportLumieresAllumees { return this.rapport.VerificationsN.QuellesLumieresAllumeesN; }    
    private get quellesIssuesOuvertes() : RapportIssuesConcernees { return this.rapport.VerificationsN.QuellesIssuesOuvertesN; }  
    private get quellesEffractions() : RapportIssuesConcernees { return this.rapport.VerificationsN.QuellesEffractionsN; }  
    private get listMainCour() : MainCourante[] { return Array.isArray( this.intervention.MainCourantes ) ?  this.intervention.MainCourantes : [] };
    // this.intervention && this.intervention.MainCourantes ? this.intervention.MainCourantes : 
    private get listTypeMainCour() : ITypeMainCourante[]
    {
         return this.interService.listeTypeMaincour;
    } 

    public get AdresseComplete() : string 
    {
        let adresse = this.site ?
            ( this.site.NumeroRue ? this.site.NumeroRue + ' ' : '' )
            + ( this.site.Adresse ? this.site.Adresse + "\n" : '' )
            + ( this.site.CodePostal ? this.site.CodePostal + ' ' : '' )
            + ( this.site.Ville ? this.site.Ville + ' ' : '' )
            : null;

        return adresse;
    }

    // liste des enums
    private MotifIntervention = MotifIntervention;
    private MotifInterventionValues = (<any> Object).values(MotifIntervention).filter( (e : any) => typeof( e ) == "number" );

    private Trajet = Trajet;
    private TrajetValues = (<any> Object).values(Trajet).filter( (e : any) => typeof( e ) == "number" );

    private TypePresence = TypePresence;
    private TypePresenceValues = (<any> Object).values(TypePresence).filter( (e : any) => typeof( e ) == "number" );

    private DepotBonIntervention = DepotBonIntervention;
    private DepotBonInterventionValues = (<any> Object).values(DepotBonIntervention).filter( (e : any) => typeof( e ) == "number" );

    private TypeSite = TypeSite;
    private TypeSiteValues = (<any> Object).values(TypeSite).filter( (e : any) => typeof( e ) == "number" );

    private CircuitVerification = CircuitVerification;
    private CircuitVerificationValues = (<any> Object).values(CircuitVerification).filter( (e : any) => typeof( e ) == "number" );
 
    private motifChoices: any[] = []; 

    // saisie d'une matin courante:
    public selectedMaincourType : ITypeMainCourante;
    public maincourComment : string = "";

    private radioValue : MotifIntervention;

    constructor( private r: Renderer, private el: ElementRef, private interService: InterventionService, private ref: ChangeDetectorRef )
    {
        // on transforme l'enum MotifIntervention en une structure clé/valeur qu'on peut binder
        this.motifChoices = (<any> Object).values(MotifIntervention).filter( (e : any) => typeof( e ) == "number" );
    }

    /**
     * Fonction appelée lorqu'un changement a lieu sur la fiche, ceci est nécessaire à cause de la stratégie de détection des changements paramétrée sur le composant:
     * changeDetection : ChangeDetectionStrategy.OnPush
     */
    public detectChanges() : void
    {
        this.ref.detectChanges();

        if ( this._intervention )
            console.log("Détection des changements pour l'affichage de l'intervention " + this._intervention.Id );
    }

    public get AutrePieceChecked() : boolean
    {
        return this.quellesLumieresAllumees.Autre != null;
    }

    public set AutrePieceChecked( value : boolean )
    {
        this.changeRapport({Verifications:{QuellesLumieresAllumees:{Autre: value? '' : null}}});

        this.quellesLumieresAllumees.Autre = value ? "" : null;
    }

    public get AutreIssueChecked() : boolean
    {
        return this.quellesIssuesOuvertes.Autre != null;
    }

    public set AutreIssueChecked( value : boolean )
    {
        this.changeRapport({Verifications:{QuellesIssuesOuvertes:{Autre:value? '' : null}}});

        this.quellesIssuesOuvertes.Autre = value ? "" : null;
    }

    public get AutreEffractionChecked() : boolean
    {
        return this.quellesEffractions.Autre != null;
    }

    public set AutreEffractionChecked( value : boolean )
    {
        this.changeRapport({Verifications:{QuellesEffractions:{Autre:value? '' : null}}});

        this.quellesEffractions.Autre = value ? "" : null;
    }

    public get AutrePresenceChecked() : boolean
    {
        return this.presence.AutrePresence != null;
    }

    public set AutrePresenceChecked( value : boolean )
    {
        this.changeRapport({Presence:{AutrePresence:value? '' : null}});

        this.presence.AutrePresence = value ? "" : null;
    }

    public get PresenceVehiculeChecked() : boolean
    {
        return this.presence.TypeVehicule != null;
    }

    public set PresenceVehiculeChecked( value : boolean )
    {
        this.changeRapport({Presence:{TypeVehicule:value? '' : null,CouleurVehicule:value? '' : null,PlaqueVehicule:value? '' : null}});

        this.presence.TypeVehicule = value ? "" : null;
        this.presence.CouleurVehicule = value ? "" : null;
        this.presence.PlaqueVehicule = value ? "" : null;
     }

    public get MiseEnPlaceDemandeeParChecked() : boolean
    {
        return this.miseEnSecurite.MiseEnPlaceDemandeePar != null;
    }

    public set MiseEnPlaceDemandeeParChecked( value : boolean )
    {
        this.changeRapport({MiseEnSecurite:{MiseEnPlaceDemandeePar:value? '' : null}});

        this.miseEnSecurite.MiseEnPlaceDemandeePar = value ? "" : null;
    }

    public get MiseEnPlaceAnimalChecked() : boolean
    {
        return this.miseEnSecurite.MiseEnPlaceAnimal != null;
    }

    public set MiseEnPlaceAnimalChecked( value : boolean )
    {
        this.changeRapport({MiseEnSecurite:{MiseEnPlaceAnimal:value? '' : null}});

        this.miseEnSecurite.MiseEnPlaceAnimal = value ? "" : null;
    }

    private gridStackInit = false;
    public ngAfterViewChecked() : void
    {
        //  L'appel de la fonction gridstack permet de rendre les composants de la doit être faite après la construction complète de la vue
        // console.log("column number : " + this.ColumnNumber);
        // var options = { width: this.ColumnNumber };
        // let grid = jQuery('.grid-stack').gridstack(options); 
    }

    /**
     * 
     * @param key Retourne le libelle d'une main courante, connaissant son id
     */
    getTypeMaincourValue( key: number ) : string
    {
        // retourne le libellé du type de main courante ou "inconnu" si le type n'existe pas:
        let foundMainCour =  this.interService.listeTypeMaincour.find( e => e.Type == key )
            || this.interService.listeM1LibelleDivers.find( e => e.Type == key );

        return foundMainCour ? foundMainCour.Libelle : "Type inconnu";
    }

    isChecked( value : MotifIntervention ) : boolean
    {
        return this.intervention.Rapport.MotifIntervention == value;
    }

    private detailForm : FormGroup;
    


    Capitalize( text: string) : string
    {
        return text != null ?
            text.toLowerCase().replace( /_/g, " " ).replace(/\b\w/g, l => l.toUpperCase())
            : null;
    }

    TelMail( label : string, text: string) : string
    {
        if ( label == null || text == null )
            return label;

        let result : string = "";

        if ( text.match(/[_A-Za-z0-9-\.]+@[_A-Za-z0-9-\.]+/) != null )
            result +="Mél ";

        if ( text.match(/[0-9]+/) != null )
            result +="Tel ";

        result += label.replace( /_/g, " " ).replace( /telephone/g, "").toLowerCase();

        return result;
    }

    public addNewMaincourante() : void
    {
        if ( ! this.selectedMaincourType)
        {
            // toto animation pour higlighter la sélection du type de main courante
            return;
        }
        else
        {
            this.interService.addNewMaincourante( this.intervention.Id, this.selectedMaincourType, this.maincourComment );
        }
    }

    changeVerifIntegraleIssues(event: any) : void
    {
        console.log(event);
    }

    public get displayRaisonNonVerificationIssues() : boolean {
        return this.arriveeSurLieux.VerifIntegraleIssues;
    }

    public changeRapport( data : any )
    {
        console.log( data );

        var p = new Promise<void>( (resolve) => {

            Lodash.merge( this.rapport, data);

            // envoi du changement dans le rapport
            this.interService.sendInterChange( { Id:this.intervention.Id, Rapport:data } );
        } );
    }



}
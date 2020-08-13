import { ITypeMainCourante } from '../../model/type_maincour';
import { RapportNonAccesAuSite } from '../../model/rapport_non_acces_au_site';
import { forEach } from 'typescript-collections/dist/lib/arrays';
import { MainCourante } from '../../model/main_courante';
import { Intervenant } from '../../model/intervenant';
import { InfosFacturation } from '../../model/infos_facturation';
import { Site } from '../../model/site';
import { Rapport } from '../../model/rapport';
import { RapportTrajet } from '../../model/rapport_trajet';
import { RapportIssuesConcernees } from '../../model/rapport_issues_concernees';
import { RapportLumieresAllumees } from '../../model/rapport_lumieres';
import { RapportVerifications } from '../../model/rapport_verifications';
import { RapportPresence} from "../../model/rapport_presence";
import { Alarme} from "../../model/alarme";
import { RapportMiseEnSecurite} from '../../model/rapport_mise_en_securite';
import { RapportArriveeSurLieux} from '../../model/rapport_arrivee_sur_lieux';
import * as Lodash from 'lodash';


/**
 * Created by abreneli on 01/07/2016.
 */

import {

    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    NgZone

} from '@angular/core';

import { Intervention } from '../../model/intervention';
import { TypeFiche, Trajet, MotifIntervention, TypePresence, DepotBonIntervention, Etat, TypeSite, CircuitVerification, AppelPourCR,
   OrigineConstatee, VerificationSysteme, RapportValidationStatusEnum } from '../../model/enums';
import { InterventionService } from "../../services/intervention.service";
import { ConnectionStatus } from "../../services/connection.status";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Telephone } from '../../model/telephone';
import { NgForm } from '@angular/forms';
import { ReactiveCheckboxComponent } from '../reactive-components/reactive-checkbox.component';
import { ReactiveDateInputComponent } from '../reactive-components/reactive-date.input.component';


declare var require: any;
var Masonry  = require( 'masonry-layout' );

@Component({
    moduleId: module.id,
    selector: 'intervention-details',
    templateUrl: './intervention.details.html',
    styleUrls: ['./intervention.details.css'],

    // pour des raisons de performance, les champs ne seront mis à jour que sur un appel de onChangeCallback
    changeDetection : ChangeDetectionStrategy.OnPush
})

export class InterventionDetails
{
    interventionChangeSubscription : Subscription;

    // l'intervention affichée est passée en paramètre du composant
    private _intervention: Intervention;

    private _oldValidationStatus: RapportValidationStatusEnum;

    // C'est juste pour avoir l'enum Etat accessible dans le template
    private Etat = Etat;

    @Input() public set intervention( value : Intervention )  {
        this._intervention = value;

        // à chaque changement d'intervention affichée le composant s'abonne aux changements de l'intervention correspondante
        if ( this.interventionChangeSubscription )
            this.interventionChangeSubscription.unsubscribe();

        this.interventionChangeSubscription =
            this._interService.newInterData$.pipe(
              filter( i => this.intervention && this.intervention.Id == i.Id  ) )
                .subscribe( i => {
                  // détection de changement pour afficher les nouvelles valeurs arrivées
                  this.updateFormWithReceivedData();
            } );

        // j'indique que l'utilisateur n'a pas encore touché au rapport
        this._oldValidationStatus = RapportValidationStatusEnum.Unknown;

        // le nombre de section peut changer la grille masonry doit être recréée
        this.reinitGrid();

    }


    private _interventionForm : NgForm;

    @ViewChild('interventionForm')
    public get interventionForm() : NgForm {
      return this._interventionForm;
    }
    public set interventionForm(value : NgForm) {
      this._interventionForm = value;
      this._interventionForm?.statusChanges.subscribe( status => this.setValidationStatus( status ) );
    }



    @ViewChild('verifAutreCheckbox') verifAutreCheckbox : ReactiveCheckboxComponent;
    @ViewChild('autrePieceAllumeeCheckbox') autrePieceAllumeeCheckbox : ReactiveCheckboxComponent;
    @ViewChild('autreIssueOuverteCheckbox') autreIssueOuverteCheckbox : ReactiveCheckboxComponent;
    @ViewChild('autreEffractionCheckbox') autreEffractionCheckbox : ReactiveCheckboxComponent;
    @ViewChild('autreTypePresenceCheckbox') autreTypePresenceCheckbox : ReactiveCheckboxComponent;
    @ViewChild('dateLancement') dateLancement : ReactiveDateInputComponent;
    @ViewChild('dateArrivee') dateArrivee : ReactiveDateInputComponent;

    @ViewChild('masonryLayout') masonryLayout;

    _dateNowPlus30 : Date;

    get dateNowPlus30() : string {
      let dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 30);
      dateNow.setSeconds( 0 );
      dateNow.setMilliseconds( 0 );

      if ( this._dateNowPlus30?.getTime() != dateNow?.getTime())
        this._dateNowPlus30 = dateNow;

      return this._dateNowPlus30.toISOString();
    };

    private grid : any;


    setValidationStatus( status )
    {
      if ( this.rapport )
      {
        this._oldValidationStatus = this.rapport.ValidationStatus;

        switch( status )
        {
          case 'VALID':
            this.rapport.ValidationStatus = RapportValidationStatusEnum.Valid; break;

          case 'INVALID':
            this.rapport.ValidationStatus = RapportValidationStatusEnum.Invalid; break;

          default:
            this.rapport.ValidationStatus = RapportValidationStatusEnum.Unknown; break;
        }
      }
    }


    /**
     * Mise à jour du formulaire avec les données reçus
     * Les données de validation sont également mise à jour
     */
    private updateFormWithReceivedData() {

      // le premier detectchange ser à mettre à jour les valeur dans les controles
      this.detectChanges();

      this.interventionForm.form.updateValueAndValidity();

      // une fois que les données sont dans les controles,
      // nouvelle détection de changement pour afficher les validités de controles à jour
      setTimeout(() => this.detectChanges(), 50);
    }

    /**
     * Reinit de la grille masonry( nécessaire quand les éléments changes)
     */
    reinitGrid()
    {
      setTimeout( () => {

        if ( this.masonryLayout )
        {
          // voir https://masonry.desandro.com/options.html pour les possiblités
          this.grid = new Masonry( '.masonry_grid', {
              itemSelector: 'section',
              columnWidth: 10,
              containerStyle: { position: 'relative' },
              horizontalOrder: true /* Lays out items to (mostly) maintain horizontal left-to-right order. */
            });

        }

      }, 50);
    }

    /**
     * Mise à jour du layout masonry
     */
    updateLayout()
    {
      setTimeout( () => {

        this.grid?.layout();

      }, 100 );
    }

    public get readOnlySection()
    {
        let readOnlySection =
            this._intervention.Etat == Etat.Annulee || this._intervention.Etat == Etat.Close
            || ! this._connectionStatus.connected

        return readOnlySection;
    }

    public get telephonesSite() : Telephone[] { return Array.isArray( this.site.Telephones ) ? this.site.Telephones : [] }
    public get intervention() : Intervention { return this._intervention; }
    private get rapport() : Rapport { return this.intervention?.Rapport; }
    private get intervenant() : Intervenant { return this.intervention?.Intervenant; }
    private get site() : Site { return this.intervention?.Site; }
    private get trajet() : RapportTrajet { return this.rapport.Trajet; }
    private get presence() : RapportPresence { return this.rapport.Presence; }
    private get miseEnSecurite() : RapportMiseEnSecurite { return this.rapport.MiseEnSecurite; }
    private get verifications() : RapportVerifications {  return this.rapport.Verifications; }
    private get arriveeSurLieux() : RapportArriveeSurLieux { return this.rapport.ArriveeSurLieux; }
    private get nonAccesAuSite() : RapportNonAccesAuSite { return this.arriveeSurLieux.NonAccesAuSite; }
    private get infosFacturation() : InfosFacturation { return this.intervention?.InfosFacturation; }

    private get quellesLumieresAllumees() : RapportLumieresAllumees
    {
        // il se peut que le serveur mette cette valeur à null
        if ( ! this.rapport.Verifications.QuellesLumieresAllumees )
            this.rapport.Verifications.QuellesLumieresAllumees = new RapportLumieresAllumees();

        return this.rapport.Verifications.QuellesLumieresAllumees;
    }


    private get quellesIssuesOuvertes() : RapportIssuesConcernees
    {
        // il se peut que le serveur mette cette valeur à null
        if ( ! this.rapport.Verifications.QuellesIssuesOuvertes )
            this.rapport.Verifications.QuellesIssuesOuvertes = new RapportIssuesConcernees();

        return this.rapport.Verifications.QuellesIssuesOuvertes;
    }


    private get quellesEffractions() : RapportIssuesConcernees
    {
        // il se peut que le serveur mette cette valeur à null
        if ( ! this.rapport.Verifications.QuellesEffractions )
            this.rapport.Verifications.QuellesEffractions = new RapportIssuesConcernees();

        return this.rapport.Verifications.QuellesEffractions;
    }


    private get listMainCour() : MainCourante[] { return Array.isArray( this.intervention.MainCourantes ) ?  this.intervention.MainCourantes : [] };
    // this.intervention && this.intervention.MainCourantes ? this.intervention.MainCourantes :
    private get listTypeMainCour() : ITypeMainCourante[]
    {
         return this._interService.listeTypeMaincour;
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

    public get Warning() : string
    {
        let warning : string = "";
        if ( this.intervention && this.intervention.Etat === Etat.Creee)
        {
            let site = this.intervention.Site;
            let intervenant = this.intervention.Intervenant;

            // Désactivé: en attente d'application mobile
            // if ( this._interService.waitingDeparture( this.intervention ) )
            //     warning = "L'intervenant est en attente d'une autorisation de départ.";

            if ( ! intervenant || ! intervenant.Societe )
                warning = "L'intervention ne peut pas être lancée car le numéro SIREN de la société d'intervention n'est pas renseigné.";

            // else if ( ! site || ! site.Latitude || ! site.Longitude )
            //     warning = "L'intervention ne peut pas être lancée car les coordonnées géographiques du site ne sont pas renseignées.";
        }

        return warning;
    }

    // liste des enums
    private MotifIntervention = MotifIntervention;
    private MotifInterventionValues = (<any> Object).values(MotifIntervention).filter( (e : any) => typeof( e ) == "number" );
    private Trajet = Trajet;
    private TypePresence = TypePresence;
    private DepotBonIntervention = DepotBonIntervention;
    private TypeSite = TypeSite;
    private TypeFiche = TypeFiche;
    private CircuitVerification = CircuitVerification;
    private AppelPourCR = AppelPourCR;
    private OrigineConstatee = OrigineConstatee;
    private VerificationSysteme = VerificationSysteme;
    private motifChoices: any[] = [];

    // saisie d'une matin courante:
    public selectedMaincourType : string;
    public maincourComment : string = "";

    private radioValue : MotifIntervention;

    public NgZone = NgZone;


    constructor( private _connectionStatus: ConnectionStatus, private _interService: InterventionService,
       private _changeDetector: ChangeDetectorRef, private _ngZone: NgZone )
    {
        // on transforme l'enum MotifIntervention en une structure clé/valeur qu'on peut binder
        this.motifChoices = Object.values(MotifIntervention).filter( (e : any) => typeof( e ) == "number" );

    }

    /**
     * Fonction appelée lorqu'un changement a lieu sur la fiche, ceci est nécessaire à cause de la stratégie de détection des changements paramétrée sur le composant:
     * changeDetection : ChangeDetectionStrategy.OnPush
     */
    public detectChanges() : void
    {
      this._ngZone.run( () => this._changeDetector.detectChanges() );
    }

    public get NonVerifAutreChecked() : boolean
    {
        return this.nonAccesAuSite.Autre != null;
    }

    public set NonVerifAutreChecked( value : boolean )
    {
        this.changeRapport({ArriveeSurLieux:{NonAccesAuSite:{Autre: value? '' : null}}})
        this.nonAccesAuSite.Autre = value ? '' : null;
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
        return this.quellesIssuesOuvertes && this.quellesIssuesOuvertes.Autre != null;
    }

    public set AutreIssueChecked( value : boolean )
    {
        this.changeRapport({Verifications:{QuellesIssuesOuvertes:{Autre:value? '' : null}}});

        this.quellesIssuesOuvertes.Autre = value ? "" : null;
    }

    public get AutreEffractionChecked() : boolean
    {
        return this.quellesEffractions && this.quellesEffractions.Autre != null;
    }

    public set AutreEffractionChecked( value : boolean )
    {
        this.changeRapport({Verifications:{QuellesEffractions:{Autre:value? '' : null}}});

        this.quellesEffractions.Autre = value ? "" : null;
    }

    public get AutrePresenceChecked() : boolean
    {
        return this.presence && this.presence.AutrePresence != null;
    }

    public set AutrePresenceChecked( value : boolean )
    {
        this.changeRapport({Presence:{AutrePresence:value? '' : null}});

        this.presence.AutrePresence = value ? "" : null;
    }

    public get PresenceVehiculeChecked() : boolean
    {
        let checked: boolean;
        if ( this.presence && ( this.presence.TypeVehicule || this.presence.CouleurVehicule || this.presence.PlaqueVehicule ) )
            checked = true;
        else
            checked = false;

        return checked;
    }

    public set PresenceVehiculeChecked( value : boolean )
    {
        this.presence.TypeVehicule = value ? "" : null;
        this.presence.CouleurVehicule = value ? "" : null;
        this.presence.PlaqueVehicule = value ? " " : null;

        if ( ! value )
            this.changeRapport({Presence:{TypeVehicule:null, CouleurVehicule:null, PlaqueVehicule:null}});
     }

    public get GardiennageOuRondeChecked() : boolean
    {
        return this.miseEnSecurite && (this.miseEnSecurite.Gardiennage || this.miseEnSecurite.Ronde);
    }

    /**
     *
     * @param key Retourne le libelle d'une main courante, connaissant son id
     */
    getTypeMaincourValue( key: string ) : string
    {
        // retourne le libellé du type de main courante ou "inconnu" si le type n'existe pas:
        let foundMainCour =  this._interService.listeTypeMaincour.find( e => e.Id == key )
            || this._interService.listeM1LibelleDivers.find( e => e.Id == key );

        return foundMainCour ? foundMainCour.Libelle : "Type inconnu";
    }

    isChecked( value : MotifIntervention ) : boolean
    {
        return this.rapport && this.rapport.MotifIntervention == value;
    }

    Capitalize( text: string) : string
    {

        return text != null ?
            text.toLowerCase().replace( /_/g, " " ).replace(/\b\w/g, l => l.toUpperCase() )
            : null;
    }


    SpaceWords( text: string) : string
    {

        return text != null ?
            text.replace(/[a-z][A-Z]/g, l => l[0] + " " + l[1] )
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
            result +="Tél ";

        result += this.Capitalize( label.replace( /_/g, " " ).replace( /telephone/g, "") );

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
            this._interService.addNewMaincourante( this.intervention.Id, this.selectedMaincourType, this.maincourComment );
        }
    }

    changeVerifIntegraleIssues(event: any) : void
    {
    }

    public get displayRaisonNonVerificationIssues() : boolean {
        return this.arriveeSurLieux.VerifIntegraleIssues;
    }

    public changeRapport( data : any )
    {
        var p = new Promise<void>( (resolve) => {

            if ( this._oldValidationStatus != this.rapport.ValidationStatus )
              Lodash.merge( data, { ValidationStatus : this.rapport.ValidationStatus } );

            // envoi du changement dans le rapport
            this._interService.sendInterChange( { Id:this.intervention.Id, Rapport:data } );
        } );


        // parfois les styles de validation des groupes de checkoxes ne se mettent pas à jour quand
        // on modifie la valeur d'une checkbox
        this.detectChanges();
    }

    public get isEditableTypeFiche() : boolean
    {
        return this.intervention.Etat == Etat.Creee;
    }

    public changeIntervention( data : any )
    {
        console.log( "Changement de l'intervention " + data );

        var p = new Promise<void>( (resolve) => {

            data.Id = this.intervention.Id;

            // envoi du changement dans l'intervention
            this._interService.sendInterChange( data );

            // c'est pour la validation des champs qui dépendent du champs modifié
            // exemple: champs dateArrivee dépend de dateLancement modifié
            this.detectChanges();
        } );
    }


    /** Envoi d'un changmenent d'email au service
     *
     */
    public _concatenated : string = "";
    public get concatenatedEmails() : string
    {
      let concatenated : string = "";
      let emails = this.intervenant?.Emails;
      if ( emails )
      {
        Object.keys(emails).map( k => concatenated += (emails[k] ?? "") + "\n");
        concatenated = concatenated.trim();
      }

      return ( this._concatenated = concatenated );
    }

    public set concatenatedEmails( value : string )
    {
      let emails = value.split( /[ ,;\n]+/ ).map( email => email.trim() );

      // on vide les champs
      for (let i = 0; i < this.intervenant.Emails.length; i++)
        this.intervenant.Emails[i] = "";

      // on merge les champs au cas où ya moins de mail
      Lodash.merge( this.intervenant.Emails, emails );

      if ( this._concatenated != this.concatenatedEmails )
        this.changeIntervention({ Intervenant: {Emails: this.intervenant.Emails}});
    }

    public changeInfoFactu( data : any )
    {
        console.log( data );

        var p = new Promise<void>( (resolve) => {

            Lodash.merge( this.intervention, data);

            // envoi du changement dans le rapport
            this._interService.sendInterChange( { Id:this.intervention.Id, InfosFacturation:data } );
        } );
    }

    public validateForm( event: any)
    {
      console.warn("Validate Form", event);
    }

    public verifCircuitKO() : boolean
    {
      // if ( this.arriveeSurLieux.CircuitVerification == CircuitVerification.VerificationKO
      //   && this.arriveeSurLieux.
      return false;
    }
/*
    public updateArrivee( dateString: string )
    {
        if ( dateString )
        {
            try
            {
                let arrivee: Date = new Date( dateString );
                this.intervention.DateArrivee = arrivee;

                // envoi du changement de date d'arrivée
                this._interService.sendInterChange( { Id:M1this.intervention.Id, DateArrivee: arrivee } );
            }
            catch( error )
            {
                console.warn( error );
            }
        }

    }

    public updateDepart( dateString: string )
    {
        if ( dateString )
        {
            try
            {
                let depart: Date = new Date( dateString );
                this.intervention.DateDepart = depart;

                // envoi du changement de date de départ
                this._interService.sendInterChange( { Id:this.intervention.Id, DateDepart: depart } );
            }
            catch( error )
            {
                console.warn( error );
            }
        }
    }
*/

    rapportWasDisplayed : boolean = false;
    public get rapportDisplayed() : boolean
    {
      let rapportIsDisplayed : boolean = (this.rapport && ! [Etat.Creee].includes( this.intervention.Etat ) );

      if ( rapportIsDisplayed != this.rapportWasDisplayed )
      {
        // je réinitialise la grille car le nombre d'éléments est impacté par cette variable
        this.reinitGrid();

        this.rapportWasDisplayed = rapportIsDisplayed;
      }

      return ( rapportIsDisplayed );
    }


    ngOnDestroy()
    {
        if ( this.interventionChangeSubscription )
            this.interventionChangeSubscription.unsubscribe();
    }

    public parseBoolean(value : any) : boolean
    {
        if(value === undefined || value === null)
        {
            return null;
        }
        return JSON.parse(value);
    }
}

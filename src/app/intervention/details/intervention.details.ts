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
import { RapportPresence } from "../../model/rapport_presence";
import { Alarme} from "../../model/alarme";
import { RapportMiseEnSecurite } from '../../model/rapport_mise_en_securite';
import { RapportArriveeSurLieux } from '../../model/rapport_arrivee_sur_lieux';
import { RapportGardiennageRonde } from '../../model/rapport_gardiennage_ronde';
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
import { RapportIncidents } from 'app/model/rapport_incidents';


declare var require: any;
var Masonry  = require( 'masonry-layout' );

@Component({
    moduleId: module.id,
    selector: 'intervention-details',
    templateUrl: './intervention.details.html',
    styleUrls: ['./intervention.details.css'],

    // pour des raisons de performance, les champs ne seront mis ?? jour que sur un appel de onChangeCallback
    changeDetection : ChangeDetectionStrategy.OnPush
})

export class InterventionDetails
{
    interventionChangeSubscription : Subscription;

    // l'intervention affich??e est pass??e en param??tre du composant
    private _intervention: Intervention;

    private _oldValidationStatus: RapportValidationStatusEnum;

    // C'est juste pour avoir l'enum Etat accessible dans le template
    private Etat = Etat;

    @Input() public set intervention( value : Intervention )  {
        this._intervention = value;

        // ?? chaque changement d'intervention affich??e le composant s'abonne aux changements de l'intervention correspondante
        if ( this.interventionChangeSubscription )
            this.interventionChangeSubscription.unsubscribe();

        this.interventionChangeSubscription =
            this._interService.newInterData$.pipe(
              filter( i => this.intervention && this.intervention.Id == i.Id  ) )
                .subscribe( i => {
                  // d??tection de changement pour afficher les nouvelles valeurs arriv??es
                  this.updateFormWithReceivedData();
            } );

        // j'indique que l'utilisateur n'a pas encore touch?? au rapport
        this._oldValidationStatus = RapportValidationStatusEnum.Unknown;

        // le nombre de section peut changer la grille masonry doit ??tre recr????e
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
    @ViewChild('autreIncidentCheckbox') autreIncidentCheckbox : ReactiveCheckboxComponent;
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
     * Mise ?? jour du formulaire avec les donn??es re??us
     * Les donn??es de validation sont ??galement mise ?? jour
     */
    private updateFormWithReceivedData() {

      // le premier detectchange ser ?? mettre ?? jour les valeur dans les controles
      this.detectChanges();

      this.interventionForm.form.updateValueAndValidity();

      // une fois que les donn??es sont dans les controles,
      // nouvelle d??tection de changement pour afficher les validit??s de controles ?? jour
      setTimeout(() => this.detectChanges(), 50);
    }

    /**
     * Reinit de la grille masonry( n??cessaire quand les ??l??ments changes)
     */
    reinitGrid()
    {
      setTimeout( () => {

        if ( this.masonryLayout )
        {
          // voir https://masonry.desandro.com/options.html pour les possiblit??s
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
     * Mise ?? jour du layout masonry
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
            || ! this._connectionStatus.connected;

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
        // il se peut que le serveur mette cette valeur ?? null
        if ( ! this.rapport.Verifications.QuellesLumieresAllumees )
            this.rapport.Verifications.QuellesLumieresAllumees = new RapportLumieresAllumees();

        return this.rapport.Verifications.QuellesLumieresAllumees;
    }


    private get quellesIssuesOuvertes() : RapportIssuesConcernees
    {
        // il se peut que le serveur mette cette valeur ?? null
        if ( ! this.rapport.Verifications.QuellesIssuesOuvertes )
            this.rapport.Verifications.QuellesIssuesOuvertes = new RapportIssuesConcernees();

        return this.rapport.Verifications.QuellesIssuesOuvertes;
    }


    private get quellesEffractions() : RapportIssuesConcernees
    {
        // il se peut que le serveur mette cette valeur ?? null
        if ( ! this.rapport.Verifications.QuellesEffractions )
            this.rapport.Verifications.QuellesEffractions = new RapportIssuesConcernees();

        return this.rapport.Verifications.QuellesEffractions;
    }

    private get quelsIncidents() : RapportIncidents
    {
        // il se peut que le serveur mette cette valeur ?? null
        if ( ! this.rapport.Verifications.QuelsIncidents )
            this.rapport.Verifications.QuelsIncidents = new RapportIncidents();

        return this.rapport.Verifications.QuelsIncidents;
    }

    private get gardiennageRonde() : RapportGardiennageRonde
    {
        // il se peut que le serveur mette cette valeur ?? null
        if (!this.rapport.GardiennageRonde)
            this.rapport.GardiennageRonde = new RapportGardiennageRonde();

        return this.rapport.GardiennageRonde;
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

            // D??sactiv??: en attente d'application mobile
            // if ( this._interService.waitingDeparture( this.intervention ) )
            //     warning = "L'intervenant est en attente d'une autorisation de d??part.";

            if ( ! intervenant || ! intervenant.Societe )
                warning = "L'intervention ne peut pas ??tre lanc??e car le num??ro SIREN de la soci??t?? d'intervention n'est pas renseign??.";

            // else if ( ! site || ! site.Latitude || ! site.Longitude )
            //     warning = "L'intervention ne peut pas ??tre lanc??e car les coordonn??es g??ographiques du site ne sont pas renseign??es.";
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
        // on transforme l'enum MotifIntervention en une structure cl??/valeur qu'on peut binder
        this.motifChoices = Object.values(MotifIntervention).filter( (e : any) => typeof( e ) == "number" );

    }

    /**
     * Fonction appel??e lorqu'un changement a lieu sur la fiche, ceci est n??cessaire ?? cause de la strat??gie de d??tection des changements param??tr??e sur le composant:
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
        // TODO GMA v??rifier si la valeur "autrePresence" est correct ou si elle devrait etre remplacer par quellesEffractions
        this.resetRapportValues("autrePresence", this.quellesEffractions.Autre, value);
    }

    public get AutreIncidentChecked() : boolean
    {
        return this.quelsIncidents && this.quelsIncidents.Autre != null;
    }

    public set AutreIncidentChecked( value : boolean )
    {
        this.changeRapport({Verifications:{QuelsIncidents:{Autre:value? '' : null}}});
        this.resetRapportValues("quelsIncidents", this.quelsIncidents.Autre, value);
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

    public get AutreRaisonGardiennageRondeChecked() : boolean
    {
        return this.gardiennageRonde.RaisonDepart.AutreRaison != null;
    }

    public set AutreRaisonGardiennageRondeChecked( value : boolean )
    {
        this.changeRapport({GardiennageRonde:{RaisonDepart:{AutreRaison: value? '' : null}}})
        this.gardiennageRonde.RaisonDepart.AutreRaison = value ? '' : null;
    }

    /**
     *
     * @param key Retourne le libelle d'une main courante, connaissant son id
     */
    getTypeMaincourValue( key: string ) : string
    {
        // retourne le libell?? du type de main courante ou "inconnu" si le type n'existe pas:
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
            result +="M??l ";

        if ( text.match(/[0-9]+/) != null )
            result +="T??l ";

        result += this.Capitalize( label.replace( /_/g, " " ).replace( /telephone/g, "") );

        return result;
    }

    public addNewMaincourante() : void
    {
        if ( ! this.selectedMaincourType)
        {
            // toto animation pour higlighter la s??lection du type de main courante
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


        // parfois les styles de validation des groupes de checkoxes ne se mettent pas ?? jour quand
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

            // c'est pour la validation des champs qui d??pendent du champs modifi??
            // exemple: champs dateArrivee d??pend de dateLancement modifi??
            this.detectChanges();
        } );
    }

    public lieuDepotIsRequired() : boolean
    {
        return this.rapport.MotifIntervention != MotifIntervention.GardiennageRonde;
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
      let emails = value.split(/[ ,;\n]+/).map(email => email.trim()).filter(email => email);
      
      // on vide les champs
      this.intervenant.Emails = emails;

      // on merge les champs au cas o?? ya moins de mail
      Lodash.merge( this.intervenant.Emails, emails );

      if ( this._concatenated != this.concatenatedEmails && this._interService.validateEmails(this.intervenant.Emails))
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

    rapportWasDisplayed : boolean = false;
    public get rapportDisplayed() : boolean
    {
      let rapportIsDisplayed : boolean = (this.rapport && ! [Etat.Creee].includes( this.intervention.Etat ) );

      if ( rapportIsDisplayed != this.rapportWasDisplayed )
      {
        // je r??initialise la grille car le nombre d'??l??ments est impact?? par cette variable
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
        if(value === undefined || value === null || value === "")
        {
            return null;
        }
        return JSON.parse(value);
    }

    public resetRapportValues(objectType : string, objectToReset : any, data : any)
    {
        // On d??fini la m??thode de reset via la partie du rapport ?? traiter
        switch(objectType){
            case "nonAccesAuSite":
                // Si l'objet parent n'est pas CircuitVerification.VerificationKO
                if(data !== CircuitVerification.VerificationKO) {
                    // On met tous les enfants ?? null
                    Object.keys(objectToReset).forEach(key => {
                        objectToReset[key] = null;
                    });

                    // On envoie la modification au service
                    this.changeRapport({ArriveeSurLieux:{NonAccesAuSite:objectToReset}});
                }
                break;

            case "raisonNonVerificationIssues":
                // Si l'objet parent est null ou vrai
                if(data === null || data) {
                    // On met l'enfant ?? null
                    this.arriveeSurLieux.RaisonNonVerificationIssues = null;

                    // On envoie la modification au service
                    this.changeRapport({ArriveeSurLieux:{RaisonNonVerificationIssues:null}});
                }
                break;

            case "autreLieuDepot":
                // Si l'objet parent n'est pas DepotBonIntervention.Autre
                if(data !== DepotBonIntervention.Autre) {
                    // On met l'enfant ?? null
                    this.rapport.AutreLieuDepot = null;

                    // On envoie la modification au service
                    this.changeRapport({AutreLieuDepot:null});
                }
                break;

            case "miseEnPlaceDemandeePar":
                // Si GardiennageOuRondeChecked est ?? faux
                if(!this.GardiennageOuRondeChecked) {
                    // On met l'enfant ?? null
                    this.miseEnSecurite.MiseEnPlaceDemandeePar = null;

                    // On envoie la modification au service
                    this.changeRapport({MiseEnSecurite:{MiseEnPlaceDemandeePar:null}});
                }
                break;

            case "precisionAnimaux":
                // Si l'objet parent est null ou faux
                if(!data) {
                    // On met l'enfant ?? null
                    this.presence.PrecisionAnimaux = null;

                    // On envoie la modification au service
                    this.changeRapport({Presence:{PrecisionAnimaux:null}});
                }
                break;

            case "presenceVehicule":
                // Si l'objet parent est null ou faux
                if(!data) {
                    // On met tous les enfants ?? null
                    this.presence.TypeVehicule = null;
                    this.presence.CouleurVehicule = null;
                    this.presence.PlaqueVehicule = null;

                    // On envoie la modification group??e au service
                    this.changeRapport({Presence:{TypeVehicule:null, CouleurVehicule:null, PlaqueVehicule:null}});
                }
                break;

            case "autrePresence":
                // Si l'objet parent est null ou faux
                if(!data) {
                    // On met l'enfant ?? null
                    objectToReset = null;

                    // On envoie la modification au service
                    this.changeRapport({Presence:{AutrePresence:objectToReset}});
                }
                break;

            case "quellesLumieresAllumees":
            case "quellesIssuesOuvertes":
            case "quelsIncidents":
            case "quellesEffractions":
                // Si l'objet parent est null ou faux
                if(!data) {
                    // On met tous les enfants ?? null
                    Object.keys(objectToReset).forEach(key => {
                        objectToReset[key] = null;
                    });

                    // On envoie la modification group??e au service
                    switch(objectType){
                        case "quellesLumieresAllumees":
                            this.changeRapport({Verifications:{QuellesLumieresAllumees:objectToReset}});
                            break;

                        case "quellesIssuesOuvertes":
                            this.changeRapport({Verifications:{QuellesIssuesOuvertes:objectToReset}});
                            break;

                        case "quellesEffractions":
                            this.changeRapport({Verifications:{QuellesEffractions:objectToReset}});
                            break;
                        case "quelsIncidents":
                            this.changeRapport({Verifications:{QuelsIncidents:objectToReset}});
                            break;
                    }
                }
                break;
        }
    }
}

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
import { formatDate } from '@angular/common'

import * as Lodash from 'lodash';


/**
 * Created by abreneli on 01/07/2016.
 */

import {

    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges

} from '@angular/core';

import { Intervention } from '../../model/intervention';
import { OrigineFiche, TypeFiche, Trajet, MotifIntervention, TypePresence, DepotBonIntervention, Etat, TypeSite, CircuitVerification, AppelPourCR, OrigineConstatee, VerificationSysteme, AutoMC } from '../../model/enums';
import { InterventionService } from "../../services/intervention.service";
import { ConnectionStatus } from "../../services/connection.status";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Telephone } from '../../model/telephone';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

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


export class InterventionDetails implements  OnChanges
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
            this._interService.newInterData$.pipe(filter( i => this.intervention && this.intervention.Id == i.Id  )).subscribe( i => this.detectChanges() );

        // je reinitialise le layout pour la nouvelle instruction
        this.grid = null;
    }

    private grid : any;

    ngAfterContentChecked ()
    {
        var masonryGridElement = document.querySelector(".masonry_grid");

        if ( masonryGridElement && ! this.grid )
        {
            // voir https://masonry.desandro.com/options.html pour les possiblités
            this.grid = new Masonry( '.masonry_grid', {
                itemSelector: 'section',
                columnWidth: 10,
                containerStyle: { position: 'relative' },
                horizontalOrder: true /* Lays out items to (mostly) maintain horizontal left-to-right order. */
              });
        }
    }

    updateLayout()
    {
      setTimeout( () => {
        this.grid = null;
        this.detectChanges();
      }, 50);
    }

    ngOnChanges( changes: SimpleChanges )
    {
        // console.log("Changements détectés sur intervention :");
        // console.log( changes );
    }

    ngOnDestroy()
    {
        if ( this.interventionChangeSubscription )
            this.interventionChangeSubscription.unsubscribe();
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
    private get rapport() : Rapport { return this.intervention.Rapport; }
    private get intervenant() : Intervenant { return this.intervention.Intervenant; }
    private get site() : Site { return this.intervention.Site; }
    private get trajet() : RapportTrajet { return this.rapport.Trajet; }
    private get presence() : RapportPresence { return this.rapport.Presence; }
    private get miseEnSecurite() : RapportMiseEnSecurite { return this.rapport.MiseEnSecurite; }
    private get verifications() : RapportVerifications {  return this.rapport.Verifications; }
    private get arriveeSurLieux() : RapportArriveeSurLieux { return this.rapport.ArriveeSurLieux; }
    private get nonAccesAuSite() : RapportNonAccesAuSite { return this.arriveeSurLieux.NonAccesAuSite; }
    private get infosFacturation() : InfosFacturation { return this.intervention.InfosFacturation; }

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
    public selectedMaincourType : ITypeMainCourante;
    public maincourComment : string = "";

    private radioValue : MotifIntervention;

    constructor( private _connectionStatus: ConnectionStatus, private _interService: InterventionService, private ref: ChangeDetectorRef )
    {
        // on transforme l'enum MotifIntervention en une structure clé/valeur qu'on peut binder
        this.motifChoices = Object.values(MotifIntervention).filter( (e : any) => typeof( e ) == "number" );

        console.log( CircuitVerification.VerificationKO );
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

    public get NonVerifAutreRaisonChecked() : boolean
    {
        return this.nonAccesAuSite.AutreRaison != null;
    }

    public set NonVerifAutreRaisonChecked( value : boolean )
    {
        this.changeRapport({ArriveeSurLieux:{NonAccesAuSite:{AutreRaison: value? '' : null}}})
        this.nonAccesAuSite.AutreRaison = value ? "" : null;
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

    public get MiseEnPlaceDemandeeParChecked() : boolean
    {
        return this.miseEnSecurite && this.miseEnSecurite.MiseEnPlaceDemandeePar != null;
    }

    public set MiseEnPlaceDemandeeParChecked( value : boolean )
    {
        this.miseEnSecurite.MiseEnPlaceDemandeePar = value ? "" : null;

        this.changeRapport({MiseEnSecurite:{MiseEnPlaceDemandeePar:value? '' : null}});
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
        let foundMainCour =  this._interService.listeTypeMaincour.find( e => e.Type == key )
            || this._interService.listeM1LibelleDivers.find( e => e.Type == key );

        return foundMainCour ? foundMainCour.Libelle : "Type inconnu";
    }

    isChecked( value : MotifIntervention ) : boolean
    {
        return this.rapport && this.rapport.MotifIntervention == value;
    }

    private detailForm : FormGroup;



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
            result +="Tel ";

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
            this._interService.sendInterChange( { Id:this.intervention.Id, Rapport:data } );
        } );
    }

    public changeIntervention( data : any )
    {
        console.log( "Changement de l'intervention " + data );

        var p = new Promise<void>( (resolve) => {

            data.Id = this.intervention.Id;

            // envoi du changement dans l'intervention
            this._interService.sendInterChange( data );

        } );
    }

    /** Envoi d'un changmeent d'email au service
     *
     */
    public changeEmailIntervenantGenerique()
    {
      let emails = this.intervenant.Emails;
      this.changeRapport( { Intervenant: { Emails: emails } } );
    }

    public changeInstructionsDemandeParMail( data : any )
    {
        console.log( "Changement des instructions de demande par mail de l'intervention à " + data );

        var p = new Promise<void>( (resolve) => {

            Lodash.merge( this.intervention, data);

            // envoi du changement dans le site
            this._interService.sendInterChange( { Id:this.intervention.Id, InstructionsDemandeParMail:data } );
        } );
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
                this._interService.sendInterChange( { Id:this.intervention.Id, DateArrivee: arrivee } );
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
    public get updateIsDateDepartUpdatable() : boolean
    {
        var updatable = false;
        if ( this.intervention )
        {
            if ( this.intervention.Intervenant
                &&  this.intervention.Etat == Etat.EnCours )
                updatable = true;

        }
        return updatable;
    }

    public get updateIsDateArriveeUpdatable() : boolean
    {
        return this.updateIsDateDepartUpdatable;
    }

    rapportWasDisplayed : boolean = false;
    public get rapportDisplayed() : boolean
    {
      let rapportIsDisplayed : boolean = (this.rapport && ! [Etat.Creee].includes( this.intervention.Etat ) );

      if ( rapportIsDisplayed != this.rapportWasDisplayed )
      {
        // je réinitialise la grille car le nombre d'éléments est impacté par cette variable
        this.updateLayout();

        this.rapportWasDisplayed = rapportIsDisplayed;
      }

      return ( rapportIsDisplayed );
    }

    // public get concatenatedIntervenantEmails() : string { return this.intervention.Intervenant.Emails.join('\n'); }

    // public set concatenatedIntervenantEmails( string emails ) : string { return this.intervention?.Intervenant?.Emails?.join('\n'); }


}

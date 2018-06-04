import { FicheQualite } from './fiche_qualite';
import {inherits} from "util";
import {Rapport} from "./rapport";
import {OrigineFiche, Etat, TypeFiche} from "./enums";
import {Alarme} from "./alarme";
import {MainCourante} from "./main_courante";
import {Intervenant} from "./intervenant";
import {Site} from "./site";
import {Message} from "./message";
import { InfosFacturation } from './infos_facturation';

/**
 * Created by abreneli on 01/07/2016.
 */


export class Intervention 
{
    Id : number;
    Etat : Etat;
    Operateur : string;
    Origine : OrigineFiche;
    TypeFiche : TypeFiche;

    Creation : Date;
    MomentAppel : Date;
    DateArrivee : Date;
    DateAnnulation : Date;
    DateDepart : Date;
    DateDiffusion : Date;
    DateAffectation : Date;
    Lancement : Date;
    Cloture : Date;
    
    Site : Site;
    Alarme : Alarme;
    FicheQualite : FicheQualite;
    Intervenant: Intervenant;
    Rapport: Rapport;
    MainCourantes: MainCourante[]; 

    Chat: Message[];

    InfosFacturation : InfosFacturation;
    
    NotificationChange : boolean;

    get SiteN() : Site { return this.Site ? this.Site : (this.Site = new Site()) };
    get AlarmeN() : Alarme { return this.Alarme ? this.Alarme : this.Alarme = new Alarme() };
    get FicheQualiteN() : FicheQualite { return this.FicheQualite ? this.FicheQualite : this.FicheQualite = new FicheQualite() };
    get IntervenantN() : Intervenant { return this.Intervenant ? this.Intervenant : this.Intervenant = new Intervenant() };
    get RapportN(): Rapport { return this.Rapport ? this.Rapport : this.Rapport = new Rapport() };
    get MainCourantesN(): MainCourante[] { return this.MainCourantes ? this.MainCourantes : this.MainCourantes = new Array<MainCourante>()  };
    get InfosFacturationN() : InfosFacturation { return this.InfosFacturation ? this.InfosFacturation : (this.InfosFacturation = new InfosFacturation()) };

    /**
     * 
     * @param jsonData Données d'intervention
     */
    constructor()
    {
        this.Site = new Site();
        this.Alarme = new Alarme();
        this.FicheQualite = new FicheQualite();
        this.Intervenant = new Intervenant();
        this.Rapport = new Rapport();
        this.Chat = new Array<Message>();
    }

    public get NomComplet() : string
    {
        let s = this.Site;
        
        if ( s )
            return `${s.Qualite ? s.Qualite + ' ' : ''} ${s.Nom ? s.Nom + ' ': ''} ${s.Prenom ? s.Prenom : ''}`
        else
            return "";
    }

    // propriétés permettant d'afficher le label des énumérations
    get EtatLabel() : string
    {
        let etat : string = null;
        if ( this.Etat != null )
            etat = Etat[this.Etat];

        // console.log( "Traduction de la valeur " + this.Etat + " vers l'état " + etat);

        return etat;
    }

    get OrigineLabel(): string
    {
        if ( this.Origine != null )
            return OrigineFiche[this.Origine];
        else return null;
    }

    get TypeFicheLabel(): string
    {
        if ( this.TypeFiche )
            return TypeFiche[this.TypeFiche];
        else return null;
    }

    // ajoute des setters pour éviter les exceptions lors de la recopie automatique
    set EtatLabel( value : string ) {}
    set OrigineLabel( value : string ) {}
    set TypeFicheLabel( value : string ) {}


}


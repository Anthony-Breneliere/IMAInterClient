import { FicheQualite } from './fiche_qualite';
import {inherits} from "util";
import {Rapport} from "./rapport";
import {OrigineFiche, Etat, TypeFiche} from "./enums";
import {Alarme} from "./alarme";
import {MainCourante} from "./main_courante";
import {Intervenant} from "./intervenant";
import {Site} from "./site";


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
    Lancement : Date;
    Cloture : Date;
    
    Site : Site;
    Alarme : Alarme;
    FicheQualite : FicheQualite;
    Intervenant: Intervenant;
    Rapport: Rapport;

    Maincourantes: MainCourante[]; 

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);

        if ( jsonData.Intervenant )
            this.Intervenant = new Intervenant( jsonData.Intervenant );

        if ( jsonData.Alarme )
            this.Alarme = new Alarme( jsonData.Alarme );

        if ( jsonData.Rapport )
            this.Rapport = new Rapport( jsonData.Rapport );

        if ( jsonData.MainCourante ) 
            this.Maincourantes = $.map( jsonData.MainCourante, (mc) => {
                return new MainCourante( mc );
            });
    }

    // propriétés permettant d'afficher le label des énumérations
    public get EtatLabel() : string
    {
        if ( this.Etat != null )
            return Etat[this.Etat];
        else return null;
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
}


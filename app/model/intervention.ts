import {inherits} from "util";
import {InterventionLight} from "./interventionLight";
import {OrigineFiche} from "./enums";
import {TypeFiche} from "./enums";

/**
 * Created by abreneli on 01/07/2016.
 */
// import {Directive} from '@angular/core'
//
// @Directive( selector='')
export class Intervention extends InterventionLight
{
    OrigineLabel(): string
    {
        return OrigineFiche[this.origine];
    }

    TypeFicheLabel(): string
    {
        return TypeFiche[this.typeFiche];
    }

    creation : Date;
    lancement : Date;
    cloture: Date;
    adresseSite: string;
    adresseIntervenant: string;
    telephonesIntervenant: [string,string][];
    telephonesSite: [string,string][];
    momentAppel: Date;
    dateArrivee : Date;
    dateDepart : Date;
    matriculeIntervenant : string;
    codePEC: string;
    maincourante: string[];
    origine : OrigineFiche;
    typeFiche : TypeFiche;
}


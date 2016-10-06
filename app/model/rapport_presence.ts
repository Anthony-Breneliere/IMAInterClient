import {TypePresence} from "./enums";
/**
 * Created by abreneli on 09/08/2016.
 */

export class RapportPresence
{
    public typePresence : TypePresence;
    public presenceClientNom : string;
    public presenceClientArrivee : Date;
    public presenceContact1Nom : string;
    public presenceContact1Arrivee : Date;
    public presenceContact2Nom : string;
    public presenceContact2Arrivee : Date;
    public presenceAnimale : boolean;
    public precisionAnimaux : string;
    public gendarmerie : boolean;
    public police : boolean;
    public pompiers : boolean;
}


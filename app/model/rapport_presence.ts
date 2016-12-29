import {TypePresence} from "./enums";
/**
 * Created by abreneli on 09/08/2016.
 */

export class RapportPresence
{
    // public TypePresence : TypePresence;
    // public PresenceClientNom : string;
    // public PresenceClientArrivee : Date;
    // public PresenceContact1Nom : string;
    // public PresenceContact1Arrivee : Date;
    // public PresenceContact2Nom : string;
    // public PresenceContact2Arrivee : Date;
    public PresenceAnimale : boolean;
    public PrecisionAnimaux : string;
    public Gendarmerie : boolean;
    public Police : boolean;
    public Pompiers : boolean;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}


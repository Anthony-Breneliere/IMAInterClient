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

    // présence sur site:
    public PresenceAnimale : boolean;
    public PrecisionAnimaux : string;

    public Gendarmerie : boolean;
    public Pompiers : boolean;
    public Client : boolean;
    public Contacts : boolean;
    public AutrePresence : string;

    public PresenceVehicule : boolean;
    public TypeVehicule : string;
    public CouleurVehicule : string;
    public PlaqueVehicule : string;
}


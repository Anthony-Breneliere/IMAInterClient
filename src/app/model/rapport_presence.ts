import {TypePresence} from "./enums";
/**
 * Created by abreneli on 09/08/2016.
 */

export class RapportPresence
{
    public Id: string; // Guid
    
    // public TypePresence : TypePresence;
    // public PresenceClientNom : string;
    // public PresenceClientArrivee : string;
    // public PresenceContact1Nom : string;
    // public PresenceContact1Arrivee : string;
    // public PresenceContact2Nom : string;
    // public PresenceContact2Arrivee : string;

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


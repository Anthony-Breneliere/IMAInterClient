import {RapportVerifications} from "./rapport_verifications";
import {RapportPresence} from "./rapport_presence";
import {Alarme} from "./alarme";
import {MotifIntervention,  Trajet, DepotBonIntervention} from "./enums";

/**
 * Created by abreneli on 09/08/2016.
 */

export class Rapport
{
    public autreMotif : string;
    public autreCirconstanceTrajet : string;
    public detailIntemperies : string;
    public depotBonIntervention : boolean;
    public autreLieuDepot : string;
    public commentaires: string;
    public compteRendu : string;
    public numeroBon : string;

    public motifIntervention : MotifIntervention;
    public trajet : Trajet;
    public lieuDepotBon : DepotBonIntervention;
    public verifications : RapportVerifications;
    public presence : RapportPresence;
    public alarme : Alarme;
}


import {rapport_verifications} from "./rapport_verifications";
import {rapport_presence} from "./rapport_presence";
import {MotifIntervention} from "./enums";
import {Trajet} from "./enums";
import {DepotBonIntervention} from "./enums";

/**
 * Created by abreneli on 09/08/2016.
 */

export class rapport
{
    public evenement : string;
    public codeCanal : string;
    public heure: Date;
    public motifIntervention : MotifIntervention;
    public trajet : Trajet;
    public autreMotif : string;
    public autreTrajet : string;
    public presence : rapport_presence;
    public verifications : rapport_verifications;
    public depotBonIntervention : boolean;
    public lieuDepotBon : DepotBonIntervention;
    public autreLieuDepot : string;
    public commentaires: string;
    public compteRendu : string;
}


import { RapportTrajet } from './rapport_trajet';
import {RapportVerifications} from "./rapport_verifications";
import {RapportPresence} from "./rapport_presence";
import {Alarme} from "./alarme";
import {MotifIntervention,  RapportValidationStatusEnum, DepotBonIntervention} from "./enums";
import {RapportMiseEnSecurite} from './rapport_mise_en_securite';
import {RapportArriveeSurLieux} from './rapport_arrivee_sur_lieux';
import { RapportGardiennageRonde } from './rapport_gardiennage_ronde';

/**
 * Created by abreneli on 09/08/2016.
 */

export class Rapport
{
    Id: string; // Guid
    LieuDepotBon : DepotBonIntervention;
    AutreLieuDepot : string;
    Observations: string;
    Consignes: string;

    MotifIntervention : MotifIntervention;
    NumeroBon : string;
    AutreCirconstanceTrajet : string;

    ArriveeSurLieux: RapportArriveeSurLieux;
    Verifications : RapportVerifications;
    MiseEnSecurite: RapportMiseEnSecurite;
    Presence : RapportPresence;
    Trajet : RapportTrajet;
    GardiennageRonde : RapportGardiennageRonde;

    ValidationStatus: RapportValidationStatusEnum;

    // get ArriveeSurLieuxN() : RapportArriveeSurLieux { return this.ArriveeSurLieux ? this.ArriveeSurLieux : this.ArriveeSurLieux = new RapportArriveeSurLieux() }
    // get VerificationsN() : RapportVerifications { return this.Verifications ? this.Verifications : this.Verifications = new RapportVerifications() }
    // get MiseEnSecuriteN() : RapportMiseEnSecurite { return this.MiseEnSecurite ? this.MiseEnSecurite : this.MiseEnSecurite = new RapportMiseEnSecurite() }
    // get PresenceN() : RapportPresence { return this.Presence ? this.Presence : this.Presence = new RapportPresence() }
    // get TrajetN() : RapportTrajet { return this.Trajet ? this.Trajet : this.Trajet = new RapportTrajet() }

    constructor()
    {
        this.ArriveeSurLieux = new RapportArriveeSurLieux();
        this.Verifications = new RapportVerifications();
        this.MiseEnSecurite = new RapportMiseEnSecurite();
        this.Presence = new RapportPresence();
        this.Trajet = new RapportTrajet();
        this.GardiennageRonde = new RapportGardiennageRonde();
        this.ValidationStatus = RapportValidationStatusEnum.Unknown;
    }
}


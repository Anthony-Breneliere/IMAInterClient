import { RapportTrajet } from './rapport_trajet';
import {RapportVerifications} from "./rapport_verifications";
import {RapportPresence} from "./rapport_presence";
import {Alarme} from "./alarme";
import {MotifIntervention,  Trajet, DepotBonIntervention} from "./enums";
import {RapportMiseEnSecurite} from './rapport_mise_en_securite';
import {RapportArriveeSurLieux} from './rapport_arrivee_sur_lieux';

/**
 * Created by abreneli on 09/08/2016.
 */

export class Rapport
{
    DepotBonIntervention : boolean;
    LieuDepotBon : DepotBonIntervention;
    AutreLieuDepot : string;
    Commentaires: string;
    Observations: string;

    MotifIntervention : MotifIntervention;
    NumeroBon : string;
    AutreCirconstanceTrajet : string;

    RapportArriveeSurLieux: RapportArriveeSurLieux;
    Verifications : RapportVerifications;
    RapportMiseEnSecurite: RapportMiseEnSecurite;
    Presence : RapportPresence;
    RapportTrajet : RapportTrajet;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);

        if ( jsonData.RapportPresence )
            this.Presence = new RapportPresence( jsonData.RapportPresence );

        if ( jsonData.RapportVerifications )
            this.Verifications = new RapportVerifications( jsonData.RapportVerifications );

        if ( jsonData.RapportArriveeSurLieux )
            this.RapportArriveeSurLieux = new RapportArriveeSurLieux( jsonData.RapportArriveeSurLieux );

        if ( jsonData.RapportMiseEnSecurite )
            this.RapportMiseEnSecurite = new RapportMiseEnSecurite( jsonData.RapportMiseEnSecurite );

        if ( jsonData.RapportTrajet )
            this.RapportTrajet = new RapportTrajet( jsonData.RapportTrajet );

    }
}


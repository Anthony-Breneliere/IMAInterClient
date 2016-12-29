import { TypeSite, CircuitVerification } from './enums'
import { RapportNonAccesAuSite } from './rapport_non_acces_au_site'

export class RapportArriveeSurLieux
{

    NumeroDeRue: string;
    NomSurLaPosteBAL: string;
    TypeDeSite: TypeSite;
    CircuitVerification: CircuitVerification;

    NonAccesAuSite: RapportNonAccesAuSite;
    UtilisationMoyensAccess: boolean;

    VerifIntegraleIssues: boolean;
    RaisonNonVerificationIssues: string;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);

        if ( jsonData.NonAccesAuSite )
            this.NonAccesAuSite = new RapportNonAccesAuSite( jsonData.NonAccesAuSite );
    }

}
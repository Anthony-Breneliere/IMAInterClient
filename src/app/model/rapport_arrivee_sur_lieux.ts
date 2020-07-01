import { TypeSite, CircuitVerification } from './enums'
import { RapportNonAccesAuSite } from './rapport_non_acces_au_site'

export class RapportArriveeSurLieux
{
    NumeroDeRue: string;
    NomSurLaPorteBAL: string;
    TypeDeSite: TypeSite;
    UtilisationMoyensAcces: boolean;
    VerifIntegraleIssues: boolean;
    RaisonNonVerificationIssues: string;
    SituationAnormale: boolean
    CircuitVerification: CircuitVerification; // (enum)

    NonAccesAuSite: RapportNonAccesAuSite;

  //  get RapportNonAccesAuSiteN() : RapportNonAccesAuSite { return this.NonAccesAuSite ? this.NonAccesAuSite : this.NonAccesAuSite = new RapportNonAccesAuSite() }

    constructor()
    {
         this.NonAccesAuSite = new RapportNonAccesAuSite();
    }

}
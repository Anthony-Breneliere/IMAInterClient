import { RapportDepartSite } from "./rapport_depart_site";

export class RapportGardiennageRonde
{
    RaisonDepart: RapportDepartSite;
    Commentaires: string;

    constructor()
    {
        this.RaisonDepart = new RapportDepartSite();
    }
}
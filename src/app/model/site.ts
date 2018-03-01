import {Telephone} from "./telephone";

/**
 * Classe site
 */
export class Site
{
    Id: number;
    Contrat : string;
    Nom : string;
    Prenom : string;
    Qualite : string;
    NumeroRue : string;
    Adresse : string;
    CodePostal : string;
    Ville : string;
    Telephones : Telephone[];
    Latitude : number;
    Longitude : number;

    get TelephonesN() : Telephone[] { return this.Telephones ? this.Telephones : (this.Telephones = []) }

    costructor()
    {
        this.Telephones = new Array<Telephone>();
    }
}

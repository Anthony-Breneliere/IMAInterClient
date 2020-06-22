import {Telephone} from "./telephone";

/**
 * Classe site
 */
export class Site
{
    Id: string; // Guid
    IdM1: number;
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
    Informations : string;

   // get TelephonesN() : Telephone[] { return this.Telephones ? this.Telephones : (this.Telephones = []) }

    constructor()
    {
        this.Telephones = new Array<Telephone>();
    }
}

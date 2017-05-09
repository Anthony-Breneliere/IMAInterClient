import {Telephone} from "./telephone";

/**
 * Classe site
 */
export class Site
{
    Id: number;
    Contrat : string;
    Client : string;
    Adresse : string;
    Telephones : Telephone[];

    get TelephonesN() : Telephone[] { return this.Telephones ? this.Telephones : this.Telephones = new Array<Telephone>() }

    costructor()
    {
        this.Telephones = new Array<Telephone>();
    }
}

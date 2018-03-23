import { Telephone } from "./telephone"
import { TimeInterval } from "rxjs";

export class Intervenant
{
    Societe: string;
    Adresse: string;
    Email: string;
    Matricule : string;
    Nom : string;
    Telephones: Telephone[];
    Latitude : number;
    Longitude : number;
    DelaiMinutes : number;

    get TelephonesN() : Telephone[] { return this.Telephones ? this.Telephones : this.Telephones = [] }

    constructor()
    {
        this.Telephones = [];
    }
}
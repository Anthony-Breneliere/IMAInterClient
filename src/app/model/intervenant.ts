import { Telephone } from "./telephone"

export class Intervenant
{
    Id: string; // Guid
    Societe: string;
    Adresse: string;
    Emails: string[];
    Matricule : string;
    Nom : string;
    Telephones: Telephone[];
    Latitude : number;
    Longitude : number;
    DelaiMinutes : number;
    IsMobileManaged : boolean;

 //   get TelephonesN() : Telephone[] { return this.Telephones ? this.Telephones : this.Telephones = [] }

    constructor()
    {
        this.Telephones = [];
    }
}

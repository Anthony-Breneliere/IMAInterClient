import { Telephone } from "./telephone"

export class Intervenant
{
    Adresse: string;
    Email: string;
    Matricule : string;
    Nom : string;
    Telephones: Telephone[];

    get TelephonesN() : Telephone[] { return this.Telephones ? this.Telephones : this.Telephones = new Array<Telephone>() }

    constructor()
    {
        this.Telephones = new Array<Telephone>();
    }
}
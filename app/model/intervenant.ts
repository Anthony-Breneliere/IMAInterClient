import { Telephone } from "./telephone"

export class Intervenant
{
    Adresse: string;
    Email: string;
    Matricule : string;
    NomIntervenant : string;
    Telephones: Telephone[];

    constructor( jsonData : Object )
    {
        $.extend( this, jsonData);
    }
}
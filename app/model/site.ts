import {Telephone} from "./telephone";

/**
 * Classe site
 */
export class Site
{
    Client : string;
    Adresse : string;
    Telephones : Telephone[];
    
    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}

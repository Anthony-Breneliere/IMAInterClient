
export class RapportMeteo
{
    VentFort: boolean;
    Pluie: boolean;
    Orage: boolean;
    Brouillard: boolean;
    Neige: boolean;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}
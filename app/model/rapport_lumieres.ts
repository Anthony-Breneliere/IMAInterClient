export class RapportLumieres
{
    Buanderie: boolean;
    Bureau: boolean;
    Cellier: boolean;
    Couloir: boolean;
    Chambre: boolean;
    Cuisine: boolean;
    Etages: number[];
    Exterieur: boolean;
    Garage: boolean;
    SalleDeBain: boolean;
    SalonOuSalleAManger: boolean;
    Toilettes: boolean;
    Autre: string; 

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}
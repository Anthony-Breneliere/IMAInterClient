
export class RapportMiseEnSecurite
{
    SiteRefermable: boolean;
    MiseEnPlaceADS: boolean;
    MiseEnPlaceMaitreChien: boolean;
    MisePlaceDemandeePar: string;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}
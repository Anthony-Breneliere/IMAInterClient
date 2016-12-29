import { RapportMeteo } from './rapport_meteo';


export class RapportTrajet
{
    Meteo: RapportMeteo;
    MotifDelai: string;
    DetailMeteo: string;
    ProblemeCirculation: boolean;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);

        if ( jsonData.Meteo )
            this.Meteo = new RapportMeteo( jsonData.Meteo );
    }
}
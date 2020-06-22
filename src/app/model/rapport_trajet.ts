import { RapportMeteo } from './rapport_meteo';


export class RapportTrajet
{
    Id: string; // Guid
    Meteo: RapportMeteo;
    MotifDelai: string;
    DetailMeteo: string;
    ProblemeCirculation: boolean;

 //   get MeteoN() : RapportMeteo { return this.Meteo ? this.Meteo : this.Meteo = new RapportMeteo() }

    constructor()
    {
        this.Meteo = new RapportMeteo();
    }
}
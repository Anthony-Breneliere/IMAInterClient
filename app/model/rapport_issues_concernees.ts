export class RapportIssuesConcernees
{
    Porte: boolean;
    Fenetre: boolean;
    BaieVitree: boolean;
    Portail: boolean;
    Portillon: boolean;
    RideauMetallique: boolean;
    Autre: string;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}
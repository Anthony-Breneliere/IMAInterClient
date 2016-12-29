

export class RapportNonAccesAuSite
{
    PortailInfranchissable: boolean;
    AbsenceMoyensAcces: boolean;
    AbsenceDigicode: boolean;
    NonAccesPortePalliere: boolean;
    AutreRaison: string;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);
    }
}
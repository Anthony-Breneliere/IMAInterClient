
import { RapportLumieres } from './rapport_lumieres';
import { RapportIssuesConcernees } from './rapport_issues_concernees';

/**
 * Created by abreneli on 09/08/2016.
 */

export class RapportVerifications
{
    RapportLumieres: RapportLumieres;
    RapportIssuesOuvertes: RapportIssuesConcernees;
    RapportEffraction: RapportIssuesConcernees;
     
    Sirene: boolean;
    SystemeEnService: boolean;

    constructor( jsonData : any )
    {
        $.extend( this, jsonData);

        if ( jsonData.RapportLumieres )
            this.RapportLumieres = new RapportLumieres( jsonData.RapportLumieres );

        if ( jsonData.RapportIssuesOuvertes )
            this.RapportIssuesOuvertes = new RapportIssuesConcernees( jsonData.RapportIssuesOuvertes );

        if ( jsonData.RapportEffraction )
            this.RapportEffraction = new RapportIssuesConcernees( jsonData.RapportEffraction );
    }
}


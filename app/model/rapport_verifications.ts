
import { RapportLumieresAllumees } from './rapport_lumieres';
import { RapportIssuesConcernees } from './rapport_issues_concernees';

/**
 * Created by abreneli on 09/08/2016.
 */

export class RapportVerifications
{
    LumieresAllumees: boolean;
    IssuesOuvertes: boolean;
    Effraction: boolean;
    Sirene: boolean;
    SystemeEnService: boolean;
    RemiseEnService: boolean;

    QuellesLumieresAllumees : RapportLumieresAllumees;
    QuellesIssuesOuvertes: RapportIssuesConcernees;
    QuellesEffractions: RapportIssuesConcernees;

    get QuellesLumieresAllumeesN() : RapportLumieresAllumees { return this.QuellesLumieresAllumees ? this.QuellesLumieresAllumees : this.QuellesLumieresAllumees = new RapportLumieresAllumees() }
    get QuellesIssuesOuvertesN() : RapportIssuesConcernees { return this.QuellesIssuesOuvertes ? this.QuellesIssuesOuvertes : this.QuellesIssuesOuvertes = new RapportIssuesConcernees() }
    get QuellesEffractionsN() : RapportIssuesConcernees { return this.QuellesEffractions ? this.QuellesEffractions : this.QuellesEffractions = new RapportIssuesConcernees() }

    constructor()
    {
        this.QuellesLumieresAllumees = new RapportLumieresAllumees();
        this.QuellesIssuesOuvertes = new RapportIssuesConcernees();
        this.QuellesEffractions = new RapportIssuesConcernees();
    }
}


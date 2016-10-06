/**
 * Created by abreneli on 04/07/2016.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { InterventionLight } from '../model/interventionLight';

import 'rxjs/add/operator/toPromise';

import { Intervention } from '../model/intervention';
import { OrigineFiche, TypeFiche, MotifIntervention, Trajet, TypePresence, DepotBonIntervention } from '../model/enums';
import {ApplicationService} from "../application.service";
import {Rapport} from "../model/rapport";
import {Alarme} from "../model/alarme";
import {RapportPresence} from "../model/rapport_presence";
import {RapportVerifications} from "../model/rapport_verifications";

@Injectable()
export class InterventionService {

    private interventionsAppUrl = 'app/interventions';  // URL to web api

    constructor(private http: Http, private appService: ApplicationService) { }

    getInterventions(): InterventionLight[] {
        if ( this.appService.m1Connected )
            return interventions;
        else
            return [];
    }

    getMyInterventions(): InterventionLight[] {
        return this.getInterventions().filter(
            (i: InterventionLight) => { return this.operatorNameEqual( i.operateur ) && i.etat != "Close" } );
    }

    getOtherInterventions(): InterventionLight[] {
        return this.getInterventions().filter(
            (i: InterventionLight) => { return !this.operatorNameEqual( i.operateur ) && i.etat != "Close" } );
    }

    getCloseInterventions(): InterventionLight[] {
        return this.getInterventions().filter(
            (i: InterventionLight) => { return i.etat == "Close" } );
    }

    private operatorNameEqual( name: string ) : boolean
    {
        console.log( name.toLowerCase() + " " + this.appService.login.toLowerCase() );
        return name.toLowerCase() == this.appService.login.toLowerCase();
        // return true;
    }

    getIntervention() : Intervention
    {
        // DEMO data:
        let i = new Intervention();
        i.id = 1;
        i.numeroBon = 108570;
        i.client = "Jonathan Pryce";
        i.etat = "Transmise";
        i.operateur = "Hubert";
        i.nomIntervenant = "Dalbert";
        i.creation = new Date("2010-05-06T06:05:38");
        i.lancement = new Date("2010-05-06T06:30:01");
        i.cloture = null;
        i.adresseSite = "3. rue de la Fontaine\n44280 Fierru";
        i.adresseIntervenant = "LD Securite\n7 Impasse des Jardins de la Caradouère\n44210 Pornic";
        i.telephonesIntervenant = [ ["Tel", "0151707070"], ["Tel", "0618551261"], ["Fax", "0140580220"] ];
        i.telephonesSite = [ ["Pro", "0240565780"], ["Mobile", "0618124595"], ["email", "jojo65@wanadoo.fr"] ];
        i.momentAppel= new Date("2016-08-01T10:15:50");
        i.dateArrivee = new Date("2016-08-01T16:15:50");
        i.dateDepart = new Date("2016-08-01T16:35:15");
        i.matriculeIntervenant = "1654665dsf";
        i.codePEC = "4565FG";
        i.maincourante= [];
        i.origine = OrigineFiche.TraitementAlarme;
        i.typeFiche = TypeFiche.Intervention;
        i.selected = false;

        let r = i.rapport = new Rapport();
        r.autreLieuDepot = "Dans ta boîte";
        r.autreMotif = "On passait comme ça";
        r.autreCirconstanceTrajet = "A bicyclette";
        r.commentaires = "Pas de casse";
        r.compteRendu = "J'ai essayé de rentrer dans la maison mais tout était fermé\nJe suis donc descendu à la cave\nPas d'intrusion\nJuste du bon vin";
        r.depotBonIntervention = true;
        r.lieuDepotBon = DepotBonIntervention.BoiteAuxLettre;
        r.motifIntervention = MotifIntervention.Autre;
        r.trajet = Trajet.Autre;

        let p = r.presence = new RapportPresence();
        p.gendarmerie = true;
        p.police = true;
        p.pompiers = false;
        p.presenceAnimale = true;
        p.precisionAnimaux = "portait un képi";
        p.presenceClientArrivee = new Date("15:00:00");
        p.presenceClientNom = "M. Corleone";
        p.presenceContact1Arrivee = new Date("14:50:00");
        p.presenceContact1Nom = "gégé le voisin";

        let v = r.verifications = new RapportVerifications();
        v.baieVitreeOuverte = true;
        v.detailBaieVitreOuverte = "inaccessible, à l'étage";
        v.effraction = false;
        v.detailEffraction = "";
        v.lumiereAllumee = true;
        v.detailLumiereAllumee = "lumière de la cave";
        v.porteOuverte = true;
        v.detailPorteOuverte = "porte de la cave";
        v.verifToutesLesIssues = false;
        v.raisonNonVerifIssues = "aucune";
        v.fenetreOuverte = false;
        v.detailFenetreOuverte = "";
        v.description = "présence d'une moto de collection";

        let a = i.alarme = new Alarme();
        a.evenement = "Alarme inconnue";
        a.codeCanal = "IMG_READY";
        a.heure = new Date( "1970-01-01T16:35:15" );


        return i;
    }

    // getIntervention(id: number) {
    //     return this.getHeroes()
    //         .then(heroes => heroes.filter(hero => hero.id === id)[0]);
    // }

    // save(hero: Hero): Promise<Hero>  {
    //     if (hero.id) {
    //         return this.put(hero);
    //     }
    //     return this.post(hero);
    // }

    // delete(hero: Hero) {
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //
    //     let url = `${this.heroesUrl}/${hero.id}`;
    //
    //     return this.http
    //         .delete(url, headers)
    //         .toPromise()
    //         .catch(this.handleError);
    // }

    // Add new Hero
    // private post(hero: Hero): Promise<Hero> {
    //     let headers = new Headers({
    //         'Content-Type': 'application/json'});
    //
    //     return this.http
    //         .post(this.heroesUrl, JSON.stringify(hero), {headers: headers})
    //         .toPromise()
    //         .then(res => res.json().data)
    //         .catch(this.handleError);
    // }

    // Update existing Hero
    // private put(hero: Hero) {
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //
    //     let url = `${this.heroesUrl}/${hero.id}`;
    //
    //     return this.http
    //         .put(url, JSON.stringify(hero), {headers: headers})
    //         .toPromise()
    //         .then(() => hero)
    //         .catch(this.handleError);
    // }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}





let interventions: InterventionLight[] = [
    {
        id: 1,
        numeroBon: 108570,
        client: "Jonathan Pryce",
        etat: "Transmise",
        operateur: "Hubert",
        nomIntervenant: "Dalbert",
        selected: false
    },
    {
        id: 2,
        numeroBon: 108571,
        client: "Ben Kingsley",
        etat: "Transmise",
        operateur: "Hubert",
        nomIntervenant: "Jacky Chan",
        selected: false
    },
    {
        id: 3,
        numeroBon: 108572,
        client: "Emily Mortimer",
        etat: "Statique",
        operateur: "Lindsey",
        nomIntervenant: "Bruce Lee",
        selected: false
    },
    {
        id: 4,
        numeroBon: 108573,
        client: "Dianna Agron",
        etat: "Validee",
        operateur: "Roger",
        nomIntervenant: "Jason Statham",
        selected: false
    },
    {
        id: 5,
        numeroBon: 108574,
        client: "Lucy Hale",
        etat: "ASL",
        operateur: "Jeanne",
        nomIntervenant: "Ed Skrein",
        selected: false
    },
    {
        id: 6,
        numeroBon: 108575,
        client: "Ashley Benson",
        etat: "ASL",
        operateur: "Lucas",
        nomIntervenant: "Bebel",
        selected: false
    },
    {
        id: 7,
        numeroBon: 108576,
        client: "Ben Affleck",
        etat: "Affectee",
        operateur: "Ventura",
        nomIntervenant: "Christian Bale",
        selected: false
    },
    {
        id: 8,
        numeroBon: 108577,
        client: "Celine Dion",
        etat: "Dispatchee",
        operateur: "Ventura",
        nomIntervenant: "Bradley Cooper",
        selected: false
    },
    {
        id: 9,
        numeroBon: 108578,
        client: "Celine Dion",
        etat: "Close",
        operateur: "Hubert",
        nomIntervenant: "OSS 117",
        selected: false
    },
    {
        id: 10,
        numeroBon: 108578,
        client: "Jean-Claude Gust",
        etat: "Close",
        operateur: "Duster",
        nomIntervenant: "Sulivan",
        selected: false
    },
    {
        id: 11,
        numeroBon: 108578,
        client: "Jacques Martin",
        etat: "Close",
        operateur: "Maria",
        nomIntervenant: "Anthony",
        selected: false
    }
];

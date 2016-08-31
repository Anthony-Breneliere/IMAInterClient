/**
 * Created by abreneli on 04/07/2016.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { InterventionLight } from '../model/interventionLight';

import 'rxjs/add/operator/toPromise';

import { Intervention } from '../model/intervention';
import {ApplicationService} from "../application.service";

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
            (i: InterventionLight) => { return i.operateur == "Hubert" && i.etat != "Close" } );
    }

    getOtherInterventions(): InterventionLight[] {
        return this.getInterventions().filter(
            (i: InterventionLight) => { return i.operateur != "Hubert" && i.etat != "Close" } );
    }

    getCloseInterventions(): InterventionLight[] {
        return this.getInterventions().filter(
            (i: InterventionLight) => { return i.etat == "Close" } );
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

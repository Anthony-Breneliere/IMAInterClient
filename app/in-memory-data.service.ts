/**
 * Created by abreneli on 04/07/2016.
 */

export class InMemoryDataService {
    createDb() {
        let interventions = [
            {
                id: 1,
                numeroBon: 108570,
                client: "Jonathan Pryce",
                etat: "Transmise",
                operateur: "Hubert",
                intervenant: "Dalbert"
            },
            {
                id: 2,
                numeroBon: 108571,
                client: "Ben Kingsley",
                etat: "Transmise",
                operateur: "Hubert",
                intervenant: "Jacky Chan"
            },
            {
                id: 3,
                numeroBon: 108572,
                client: "Emily Mortimer",
                etat: "Statique",
                operateur: "Lindsey",
                intervenant: "Bruce Lee"
            },
            {
                id: 4,
                numeroBon: 108573,
                client: "Dianna Agron",
                etat: "Validee",
                operateur: "Roger",
                intervenant: "Jason Statham"
            },
            {
                id: 5,
                numeroBon: 108574,
                client: "Lucy Hale",
                etat: "ASL",
                operateur: "Jeanne",
                intervenant: "Ed Skrein"
            },
            {
                id: 6,
                numeroBon: 108575,
                client: "Ashley Benson",
                etat: "ASL",
                operateur: "Lucas",
                intervenant: "Bebel"
            },
            {
                id: 7,
                numeroBon: 108576,
                client: "Ben Affleck",
                etat: "Affectee",
                operateur: "Ventura",
                intervenant: "Christian Bale"
            },
            {
                id: 8,
                numeroBon: 108577,
                client: "Celine Dion",
                etat: "Dispatchee",
                operateur: "Ventura",
                intervenant: "Bradley Cooper"
            },
            {
                id: 9,
                numeroBon: 108578,
                client: "Celine Dion",
                etat: "Close",
                operateur: "Hubert",
                intervenant: "OSS 117"
            },
            {
                id: 10,
                numeroBon: 108578,
                client: "Jean-Claude Gust",
                etat: "Close",
                operateur: "Duster",
                intervenant: "Sulivan"
            },
            {
                id: 11,
                numeroBon: 108578,
                client: "Jacques Martin",
                etat: "Close",
                operateur: "Maria",
                intervenant: "Anthony"
            }
        ];
        return {interventions};
    }
}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
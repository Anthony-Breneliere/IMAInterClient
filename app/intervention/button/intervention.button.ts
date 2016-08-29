/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { InterventionLight } from '../../model/interventionLight';

@Component({
    selector: 'intervention-button',
    templateUrl: 'app/intervention/button/intervention.button.html',
    styleUrls: ['app/intervention/button/intervention.button.css']
})

export class InterventionButton
{
    // l'intervention est passée en paramètre du composant
    @Input() intervention: InterventionLight;

    // constructor( private intervention: Intervention ) {};

    // intervention: Intervention =
    // {
    //     id: 1,
    //     numeroBon: 108570,
    //     client: "Jonathan Pryce",
    //     etat: "Transmise",
    //     operateur: "Hubert",
    //     intervenant: "Dalbert"
    // };
}
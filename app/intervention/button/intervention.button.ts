/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Output, Input } from '@angular/core';
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
    @Output() onSelected = new EventEmitter<InterventionButton>();

    private selected: boolean = false;

    unSelect()
    {
        this.selected = false;
    }

    onClick(): void
    {
        this.selected = ! this.selected;

        // dans le cas où le bouton est sélectionné on prévient le composant parent pour la désélection
        if ( this.selected )
            this.onSelected.emit( this );
    }

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
import { Etat } from '../../model/enums';
/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Intervention } from '../../model/intervention';

@Component({
    selector: 'intervention-button',
    templateUrl: 'app/intervention/button/intervention.button.html',
    styleUrls: ['app/intervention/button/intervention.button.css']
})

export class InterventionButton
{
  
    // l'intervention est passée en paramètre du composant
    @Input() intervention: Intervention;
    @Input() selected: boolean;
    @Output() onSelected = new EventEmitter<InterventionButton>();

    onClick(): void
    {
        // dans le cas où le bouton est sélectionné on prévient le composant parent pour la désélection
        this.onSelected.emit( this );
    }
}
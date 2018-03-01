import { Etat } from '../../model/enums';
/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';

@Component({
    moduleId: module.id,
    selector: 'intervention-button',
    templateUrl: './intervention.button.html',
    styleUrls: ['./intervention.button.css']
})

export class InterventionButton
{
    // l'intervention est passée en paramètre du composant
    @Input() intervention: Intervention;
    @Input() selected: boolean;
    @Output() onSelected = new EventEmitter<InterventionButton>();
    @ViewChild(ContextMenuComponent) public buttonMenu: ContextMenuComponent;

    public get NomComplet() : string
    {
        let s = this.intervention.Site;
        
        if ( s )
            return `${s.Qualite ? s.Qualite + ' ' : ''} ${s.Nom ? s.Nom + ' ': ''} ${s.Prenom ? s.Prenom : ''}`
        else
            return "";
    }
    constructor( private interService : InterventionService )
    {}

    onClickInter(): void
    {
        // dans le cas où le bouton est sélectionné on prévient le composant parent pour la désélection
        this.onSelected.emit( this );
    }

    submit() : void 
    {
        this.interService.submit( this.intervention );
    }

    close() : void 
    {
        this.interService.close( this.intervention );
    }

    cancel() : void 
    {
        this.interService.cancel( this.intervention );
    }

    get canSubmit() : boolean 
    {
        let intervenant = this.intervention.Intervenant;
        let site = this.intervention.Site;

        let canSubmit : boolean = false;
        if ( this.intervention.Etat == Etat.Creee
            && intervenant && intervenant.Societe
            && site && site.Latitude && site.Longitude )
            canSubmit = true;

        return canSubmit;
    }

    get canClose() : boolean 
    {
        return false;
    }

    get canCancel() : boolean 
    {
        let canCancel = this.intervention.Etat != null && this.intervention.Etat != Etat.Close && this.intervention.Etat != Etat.Annulee;
        return canCancel;
    }
}
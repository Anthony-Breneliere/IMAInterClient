import { Etat } from '../../model/enums';
/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Output, Input, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { ContextMenuService } from 'ngx-contextmenu';

@Component({
    moduleId: module.id,
    selector: 'intervention-button',
    templateUrl: './intervention.button.html',
    styleUrls: ['./intervention.button.css']
})

export class InterventionButton implements OnInit
{
    private _selected : boolean;

    // l'intervention est passée en paramètre du composant
    @Input() intervention: Intervention;
    @Input() set selected(value : boolean) { this._selected = value; this.notificationChange = false };
    get selected(): boolean { return this._selected };
    @Input() updating: boolean;
    @Input() isMyInter: boolean;
    @Output() onSelected = new EventEmitter<InterventionButton>();
    @ViewChild(ContextMenuComponent) public buttonMenu: ContextMenuComponent;

    public ngOnInit()
    {
    }

    public get notificationChange() : boolean { 
        return this.intervention.NotificationChange && this.isMyInter && ! this.selected
    };

    public set notificationChange( value: boolean ) { 
        this.intervention.NotificationChange = value
    };

    constructor( private _interService : InterventionService, private contextMenuService : ContextMenuService )
    {}

    onClickInter(): void
    {
        // dans le cas où le bouton est sélectionné on prévient le composant parent pour la désélection
        this.onSelected.emit( this );

    }

    submit() : void 
    {
        this._interService.submit( this.intervention );
    }

    close() : void 
    {
        this._interService.close( this.intervention );
    }

    cancel() : void 
    {
        this._interService.cancel( this.intervention );
    }

    get canSubmit() : boolean 
    {
        let intervenant = this.intervention.Intervenant;
        let site = this.intervention.Site;

        let canSubmit : boolean = false;
        // if ( this.intervention.Etat == Etat.Creee
        //     && intervenant && intervenant.Societe
        //     && site && site.Latitude && site.Longitude )
        //     canSubmit = true;                                // latitude longitude plus obligatoire

        if ( this.intervention.Etat == Etat.Creee
            && intervenant && intervenant.Societe )
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

    get waitingDeparture() : boolean
    {
        if ( this.intervention )
            return this._interService.waitingDeparture( this.intervention );
        
        return false;
    }

    authorizeDeparture() : void
    {
        return this._interService.authorizeDeparture( this.intervention.Id );
    }

    public delayContextMenuDisplay($event: MouseEvent, intervention: Intervention): void {

        console.log( "show context menu for " + intervention.Id);

        setTimeout(() => {
            console.log( "show context menu for " + intervention.Id);

            this.contextMenuService.show.next({
                // Optional - if unspecified, all context menu components will open
                contextMenu: this.buttonMenu,
                event: $event,
                item: intervention,
            } );
        }, 500 ); 
    }
}
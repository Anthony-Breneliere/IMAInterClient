/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Output, Input, ViewChild, OnInit } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { ConnectionStatus } from '../../services/connection.status';
import { ContextMenuService } from 'ngx-contextmenu';
import { Etat } from '../../model/enums';

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

    constructor( private _interService : InterventionService, private _connectionStatus : ConnectionStatus, private contextMenuService : ContextMenuService )
    {}

    public ngOnInit()
    {
        // quand une nouvelle intervention est créée et que le bouton apparait, le menu contextuel n'est pas initialisé par
        // défaut, on l'initialise pour l'ajouter au DOM
        this.contextMenuService.show.subscribe((el) => {
            const overlay = this.contextMenuService.getLastAttachedOverlay();
            if ( overlay )
            {
                overlay.updatePosition();
                const comp: any = overlay.contextMenu;
                if (!comp._keyManager) {
                    comp.ngOnInit();
                }
                comp.changeDetector.markForCheck();
                comp.changeDetector.detectChanges();
            }
         });
    }

    public get notificationChange() : boolean {
        return this.intervention.NotificationChange && this.isMyInter && ! this.selected
    };

    public set notificationChange( value: boolean ) {
        this.intervention.NotificationChange = value
    };

    onClickInter(): void
    {
        // dans le cas où le bouton est sélectionné on prévient le composant parent pour la désélection
        this.onSelected.emit( this );

    }

    transfer() : void
    {
        this._interService.transfer( this.intervention );
    }

    close() : void
    {
        this._interService.close( this.intervention );
    }

    cancel() : void
    {
        this._interService.cancel( this.intervention );
    }

    inProgress() : void
    {
        this._interService.inProgress( this.intervention );
    }

    get connected() : boolean
    {
        return this._connectionStatus.connected;
    }

    get canTransfer() : boolean
    {
        let canTransfer : boolean = false;
        let intervenant = this.intervention.Intervenant;

        if ( this.connected && this.intervention.Etat == Etat.Creee &&
            intervenant && intervenant.Emails && intervenant.Emails.length > 0 )
            canTransfer = true;

        return canTransfer;
    }

    get canClose() : boolean
    {
        let canClose = this.connected && this.intervention.Etat != null && this.intervention.Etat == Etat.EnCours;
        return canClose;
    }

    get canCancel() : boolean
    {
        let canCancel = this.connected && this.intervention.Etat != null && this.intervention.Etat != Etat.Close && this.intervention.Etat != Etat.Annulee;
        return canCancel;
    }

    get inProgressPossible() : boolean
    {
        let inProgressPossible = this.connected && this.intervention.Etat != null && this.intervention.Etat == Etat.Transmise;
        return inProgressPossible;
    }

    // ces fonctions seront disponibles quand il y a auroa l'application mobile

    // public get waitingDeparture() : boolean
    // {
    //     if ( this.intervention )
    //         return this._interService.waitingDeparture( this.intervention );

    //     return false;
    // }

    // public authorizeDeparture() : void
    // {
    //     return this._interService.authorizeDeparture( this.intervention.Id );
    // }

    // public immobilizeIntervenant(): void
    // {
    //     return this._interService.immobilizeIntervenant( this.intervention.Id );
    // }



}

/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Output, Input, ViewChild, OnInit } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
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

    constructor( private _interService : InterventionService, private contextMenuService : ContextMenuService )
    {}

    public ngOnInit()
    {
        // quand une nouvelle intervention est créée et que le bouton apparait, le menu contextuel n'est pas initialisé par 
        // défaut, on l'initialise pour l'ajouter au DOM
        this.contextMenuService.show.subscribe((el) => {
            const overlay = this.contextMenuService.getLastAttachedOverlay();
            overlay.updatePosition();
            const comp: any = overlay.contextMenu;
            if (!comp._keyManager) {
                 comp.ngOnInit();
             }
            comp.changeDetector.markForCheck();
            comp.changeDetector.detectChanges();
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

    submit() : void 
    {
        this._interService.submit( this.intervention );
    }

    submitByMail() : void 
    {
        this._interService.submitByMail( this.intervention );
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

    get canSubmitByMail() : boolean 
    {
        let canSubmit : boolean = false;
        let intervenant = this.intervention.Intervenant;

        if ( this.intervention.Etat == Etat.Creee && 
            intervenant && intervenant.Email )
            canSubmit = true;

        return canSubmit;
    }

    get canClose() : boolean 
    {
        let canClose = this.intervention.Etat != null && this.intervention.Etat == Etat.AttenteCloture;
        return canClose;
    }

    get canCancel() : boolean 
    {
        let canCancel = this.intervention.Etat != null && this.intervention.Etat != Etat.Close && this.intervention.Etat != Etat.Annulee;
        return canCancel;
    }

    public get waitingDeparture() : boolean
    {
        if ( this.intervention )
            return this._interService.waitingDeparture( this.intervention );
        
        return false;
    }

    public authorizeDeparture() : void
    {
        return this._interService.authorizeDeparture( this.intervention.Id );
    }

    public immobilizeIntervenant(): void
    {
        return this._interService.immobilizeIntervenant( this.intervention.Id );
    }

}
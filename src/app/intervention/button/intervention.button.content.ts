import { Component, Input } from '@angular/core';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';

@Component({
    moduleId: module.id,
    selector: 'intervention-button-content',
    template: `
    <div *ngIf="intervention.Site" class="client">
        <i class="mdi mdi-account"></i> {{intervention.NomComplet}}
    </div>
    <div *ngIf="intervention.EtatLabel != 'Close'">
        <i class="mdi mdi-keyboard-tab"></i> {{intervention.EtatLabel}}
    </div>
    <div>
        <i class="mdi mdi-seat-recline-normal"></i> {{intervention.Operateur}}
    </div>
    <div>
        <i class="mdi mdi-run"></i> {{intervention.Intervenant?.Nom}}
    </div>
    <div>
        <i class="mdi mdi-alarm-multiple"></i>{{intervention.Creation | date:'long'}}</div> 
    <div *ngIf="waitingDeparture">
        <button class="transition_1s" id="authDeparture" (click)="authorizeDeparture()">Autoriser le départ</button>
    </div>
    <div *ngIf="waitingDeparture">
            <button class="transition_1s" id="authDeparture" (click)="immobilizeIntervenant()">Mise en statique</button>
    </div>
    `,
    styleUrls: ['./intervention.button.css']
})

export class InterventionButtonContent
{
    @Input() intervention: Intervention;

    constructor( private _interService : InterventionService )
    {}

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
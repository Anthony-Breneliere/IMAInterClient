import { Component, Input } from '@angular/core';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { TypeFiche } from '../../model/enums';

@Component({
    moduleId: module.id,
    selector: 'intervention-button-content',
    templateUrl: './intervention.button.content.html',
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

    public get typeFiche() : string
    {
        return this.intervention.TypeFicheLabel;
    }
}
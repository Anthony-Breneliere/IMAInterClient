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
    get isTypeFicheIntervention() : boolean
    {
        return this.intervention.TypeFiche == TypeFiche.Intervention;
    }

    get isTypeFicheGardiennage() : boolean
    {
        return this.intervention.TypeFiche == TypeFiche.Gardiennage;
    }

    get isTypeFicheGardiennageALaDemande() : boolean
    {
        return this.intervention.TypeFiche == TypeFiche.GardiennageALaDemande;
    }

    get isTypeFicheRonde() : boolean
    {
        return this.intervention.TypeFiche == TypeFiche.Ronde;
    }

    get isTypeFicheRondeALaDemande() : boolean
    {
        return this.intervention.TypeFiche == TypeFiche.RondeALaDemande;
    }

    get isTypeFicheTestReseau() : boolean
    {
        return this.intervention.TypeFiche == TypeFiche.TestReseau;
    }

    get typeFiche() : string
    {
        return this.intervention.TypeFicheLabel;
    }
}
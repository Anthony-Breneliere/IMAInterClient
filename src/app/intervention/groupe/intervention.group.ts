/**
 * Created by abreneli on 04/07/2016.
 */

import { Component,  Input, Output, EventEmitter } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';
import { SortInterventionByDateTime } from './sortInterPipe';

export enum GroupTypeEnum
{
    mesInterventions,
    autresInterventions,
    interventionsCloses
}

@Component({
    moduleId: module.id,
    selector: 'intervention-group',
    templateUrl: './intervention.group.html',
    styleUrls:  ['./intervention.group.css']
})

export class InterventionGroup  {

    @Input() public GroupName: string;
    @Input() public GroupType: GroupTypeEnum;
    @Input() public SelectedIntervention: Intervention;
    @Input() public Expanded: boolean;
    @Output() onSelectedButton = new EventEmitter<InterventionButton>();

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    constructor( private interService : InterventionService )
    {
    }

    get groupInterventions(): Intervention[]
    {
        switch( this.GroupType )
        {
            case GroupTypeEnum.interventionsCloses:
                return this.interService.CloseInterventions;

            case GroupTypeEnum.autresInterventions:
                return this.interService.OtherInterventions;

            default:
                return this.interService.MyInterventions;
        }
    }

    public onClickHeader() : void
    {
        this.Expanded = ! this.Expanded;
    }

    onSelected(newSelectedButton: InterventionButton)
    {
        // on relaie le bouton sélectionné au composant parent:
        this.onSelectedButton.emit( newSelectedButton );

    }

    searchInterventions( queryString : string )
    {
        // on recherche les interventions à partir de 4 caractères saisis
        if ( queryString.length >= 4 )
        {
            this.interService.searchInterventions( queryString );
        }
    }

}
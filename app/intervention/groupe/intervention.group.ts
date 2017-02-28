/**
 * Created by abreneli on 04/07/2016.
 */

import { Component,  Input, Output, EventEmitter } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { Intervention } from '../../model/intervention';
import { InterventionService } from '../../services/intervention.service';

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
    @Output() onSelectedButton = new EventEmitter<InterventionButton>();

//    @ViewChildren( "buttons" ) childrenButtons : InterventionButton[];

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    constructor( private interService : InterventionService )
    {
        this.expanded = false;
    }

    groupInterventions(): Intervention[]
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

    public expanded: boolean;

    public onClickHeader() : void
    {
        this.expanded = ! this.expanded;
    }

    onSelected(newSelectedButton: InterventionButton)
    {
        // on relaie le bouton sélectionné au composant parent:
        this.onSelectedButton.emit( newSelectedButton );
    }

}
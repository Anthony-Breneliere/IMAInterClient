/**
 * Created by abreneli on 04/07/2016.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { InterventionLight } from '../../model/interventionLight';
import { InterventionService } from '../intervention.service';

export enum GroupTypeEnum
{
    mesInterventions,
    autresInterventions,
    interventionsCloses
}

@Component({
    selector: 'intervention-group',
    templateUrl: 'app/intervention/groupe/intervention.group.html',
    styleUrls:  ['app/intervention/groupe/intervention.group.css']
})

export class InterventionGroup implements OnInit {

    @Input() public GroupName: string;
    @Input() public GroupType: GroupTypeEnum;
    @Output() onSelectedButton = new EventEmitter<InterventionButton>();

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    constructor( private interService : InterventionService )
    {
        this.expanded = false;
    }

    ngOnInit() : void
    {
    }

    groupInterventions(): InterventionLight[]
    {
        switch( this.GroupType )
        {
            case GroupTypeEnum.interventionsCloses:
                return this.interService.getCloseInterventions();

            case GroupTypeEnum.autresInterventions:
                return this.interService.getOtherInterventions();

            default:
                return this.interService.getMyInterventions();
        }
    }

    public selectedIntervention: InterventionLight;
    private expanded: boolean;

    public onClickHeader() : void
    {
        this.expanded = ! this.expanded;
    }

    public onClick(intervention: InterventionLight ) : void
    {
        if ( this.selectedIntervention != null )
            this.selectedIntervention.selected = false;

        intervention.selected = ! intervention.selected;

        if ( intervention.selected )
            this.selectedIntervention = intervention;
        else
            this.selectedIntervention = null;
    };

    onSelected(newSelectedButton: InterventionButton) {
        this.onSelectedButton.emit( newSelectedButton );
    }
}
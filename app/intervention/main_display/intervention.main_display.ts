/**
 * Created by abreneli on 04/07/2016.
 */

import {Component, OnInit} from '@angular/core';
import {InterventionGroup} from '../groupe/intervention.group';
import {GroupTypeEnum} from '../groupe/intervention.group';
import {InterventionDetails} from '../details/intervention.details';
import {Intervention} from "../../model/intervention";

@Component({
    selector: 'intervention-main-display',
    templateUrl: 'app/intervention/main_display/intervention.main_display.html',
    styleUrls:  ['app/intervention/main_display/intervention.main_display.css'],
    directives: [InterventionGroup, InterventionDetails]
})

export class InterventionMainDisplay {

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    public getSelectedIntervention() : Intervention
    {
        return new Intervention();
    }

}
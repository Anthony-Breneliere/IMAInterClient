/**
 * Created by abreneli on 04/07/2016.
 */

import { Component, OnInit, Input } from '@angular/core';
import { InterventionButton } from '../button/intervention.button';
import { InterventionLight } from '../../model/interventionLight';

export enum GroupTypeEnum
{
    mesInterventions,
    autresInterventions,
    interventionsCloses
}

@Component({
    selector: 'intervention-group',
    templateUrl: 'app/intervention/groupe/intervention.group.html',
    styleUrls:  ['app/intervention/groupe/intervention.group.css'],
    directives: [InterventionButton]
})

export class InterventionGroup implements OnInit {

    @Input() public GroupName: string;
    @Input() public GroupType: GroupTypeEnum;

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    constructor()
    {
        this.expanded = false;
    }

    ngOnInit() : void
    {
        console.log(this.GroupType)
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

    public interventions: InterventionLight[] = [
        {
            id: 1,
            numeroBon: 108570,
            client: "Jonathan Pryce",
            etat: "Transmise",
            operateur: "Hubert",
            nomIntervenant: "Dalbert",
            selected: false
        },
        {
            id: 2,
            numeroBon: 108571,
            client: "Ben Kingsley",
            etat: "Transmise",
            operateur: "Hubert",
            nomIntervenant: "Jacky Chan",
            selected: false
        },
        {
            id: 3,
            numeroBon: 108572,
            client: "Emily Mortimer",
            etat: "Statique",
            operateur: "Lindsey",
            nomIntervenant: "Bruce Lee",
            selected: false
        },
        {
            id: 4,
            numeroBon: 108573,
            client: "Dianna Agron",
            etat: "Validee",
            operateur: "Roger",
            nomIntervenant: "Jason Statham",
            selected: false
        },
        {
            id: 5,
            numeroBon: 108574,
            client: "Lucy Hale",
            etat: "ASL",
            operateur: "Jeanne",
            nomIntervenant: "Ed Skrein",
            selected: false
        },
        {
            id: 6,
            numeroBon: 108575,
            client: "Ashley Benson",
            etat: "ASL",
            operateur: "Lucas",
            nomIntervenant: "Bebel",
            selected: false
        },
        {
            id: 7,
            numeroBon: 108576,
            client: "Ben Affleck",
            etat: "Affectee",
            operateur: "Ventura",
            nomIntervenant: "Christian Bale",
            selected: false
        },
        {
            id: 8,
            numeroBon: 108577,
            client: "Celine Dion",
            etat: "Dispatchee",
            operateur: "Ventura",
            nomIntervenant: "Bradley Cooper",
            selected: false
        },
        {
            id: 9,
            numeroBon: 108578,
            client: "Celine Dion",
            etat: "Close",
            operateur: "Hubert",
            nomIntervenant: "OSS 117",
            selected: false
        },
        {
            id: 10,
            numeroBon: 108578,
            client: "Jean-Claude Gust",
            etat: "Close",
            operateur: "Duster",
            nomIntervenant: "Sulivan",
            selected: false
        },
        {
            id: 11,
            numeroBon: 108578,
            client: "Jacques Martin",
            etat: "Close",
            operateur: "Maria",
            nomIntervenant: "Anthony",
            selected: false
        }
    ];
}
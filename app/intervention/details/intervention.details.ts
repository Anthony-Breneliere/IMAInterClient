/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { InputTextbox } from '../../tools/input/input_textbox';
import { Section } from '../section/section';
import { Intervention } from '../../model/intervention';
import { OrigineFiche, TypeFiche } from '../../model/enums';

export class Cucu
{
    coco : string;

    Coco() : string{
        return this.coco;
    }
}

@Component({
    selector: 'intervention-details',
    templateUrl: 'app/intervention/details/intervention.details.html',
    styleUrls: ['app/intervention/details/intervention.details.css'],
    directives: [InputTextbox, Section]
})



export class InterventionDetails implements  OnInit
{
    // l'intervention est passée en paramètre du composant
    @Input() intervention: Intervention;


    cucu: Cucu;
    constructor()
    {
        // DEMO data:
        let i = this.intervention = new Intervention();
        i.id = 1;
        i.numeroBon = 108570;
        i.client = "Jonathan Pryce";
        i.etat = "Transmise";
        i.operateur = "Hubert";
        i.nomIntervenant = "Dalbert";
        i.creation = new Date("2010-05-06T06:05:38");
        i.lancement = new Date("2010-05-06T06:30:01");
        i.cloture = null;
        i.adresseSite = "3. rue de la Fontaine\n44280 Fierru";
        i.adresseIntervenant = "LD Securite\n7 Impasse des Jardins de la Caradouère\n44210 Pornic";
        i.telephonesIntervenant = [ ["Tel", "0151707070"], ["Tel", "0618551261"], ["Fax", "0140580220"] ];
        i.telephonesSite = [ ["Pro", "0240565780"], ["Mobile", "0618124595"], ["email", "jojo65@wanadoo.fr"] ];
        i.momentAppel= new Date("2016-08-01T10:15:50");
        i.dateArrivee = new Date("2016-08-01T16:15:50");
        i.dateDepart = new Date("2016-08-01T16:35:15");
        i.matriculeIntervenant = "1654665dsf";
        i.codePEC = "4565FG";
        i.maincourante= [];
        i.origine = OrigineFiche.TraitementAlarme;
        i.typeFiche = TypeFiche.Intervention;
        i.selected = false;
    }

    ngOnInit()
    {
        console.log( "origine de l''intervention: "  + this.intervention.OrigineLabel() );
    }

}
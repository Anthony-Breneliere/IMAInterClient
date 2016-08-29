/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'input-textbox',
    templateUrl: 'app/tools/input/input_textbox.html',
    // styleUrls: ['app/tools/input/input_textbox.css']
})

export class InputTextbox implements OnInit
{
    @Input() public id: string;
    @Input() public label: string;
    @Input() public width: string;
    @Input() public value: string;
    @Input() public lineNb: number;

    constructor()
    {
        this.lineNb = 1;
    }

    ngOnInit() {
        // console.log( 'Init ' + (<any>this).constructor.name + ' id:' + this.id + ' label:' + this.label );
    }

    public setStyle(): any
    {
        return  this.lineNb == 1 ?
        { 'width' : this.width }
        : { 'width' : this.width, 'height' : this.lineNb + 'em' };
    }
}
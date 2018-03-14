/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, Input, Output, ElementRef, EventEmitter  } from '@angular/core';
declare var require: any;
var ResizeSensor = require('css-element-queries/src/ResizeSensor');
// import 'jquery-ui';
// import 'gridstack';

@Component({
    moduleId: module.id,
    selector: 'section',
    templateUrl: './section.html',
    styleUrls: ['./section.css']
})
export class Section 
{
    @Input() title: string;
    @Input() color: string;
    @Input() readOnly: boolean;
    
    @Output() resize = new EventEmitter<ElementRef>();

    toMake : boolean = true;
    el: ElementRef;

    constructor( el: ElementRef )
    {
        this.el = el;
    }

    ngOnInit()
    {
        // on utilise un resize sensor pour détecter les changements de dimensionnement de l'élémément HTML de la section
        var resizeSensor = new ResizeSensor(this.el.nativeElement, () => {
            this.resize.emit( this.el );
        });
    } 

    ngAfterViewInit(): void
    {
        // var parent = $(this.el).parent();
        // var grid = parent.data('gridstack');
        // if (grid && this.toMake) {
        //     (<any> grid).makeWidget(this.el);
        //     this.toMake = false; 
        // }
    }

    disp( t: any )
    {
        console.log ( t );
    }

    clickBar()
    {
        this.expand = ! this.expand;
    }

    public expand = true;
}
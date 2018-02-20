/**
 * Created by abreneli on 01/07/2016.
 */

import { Directive, Component, Input, AfterContentInit, AfterViewInit, ContentChildren, QueryList, ViewChild, ViewChildren, ElementRef  } from '@angular/core';
import { DraggableDirective } from '../../tools/draggable'; 
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

    toMake : boolean = true;
    el: ElementRef;

    constructor( el: ElementRef )
    {
        this.el = el;
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
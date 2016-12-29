/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, Input } from '@angular/core';

@Component({
    selector: 'section',
    templateUrl: 'app/intervention/section/section.html',
    styleUrls: ['app/intervention/section/section.css']
})

export class Section
{
    @Input() title: string;
    @Input() color: string;
}
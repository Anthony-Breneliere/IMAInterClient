/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, Input } from '@angular/core';

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
}
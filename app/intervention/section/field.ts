/**
 * Created by abreneli on 01/07/2016.
 */

import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: '[field]',
    templateUrl: './field.html',
    styleUrls: ['./field.css']
})

export class Field
{
    @Input() label: string;

}
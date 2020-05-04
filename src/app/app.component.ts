/**
 * Created by abreneli on 30/06/2016.
 */
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'intervention-app',
    templateUrl: './app.component.html'
})

export class InterventionAppComponent {

    constructor( private  route: ActivatedRoute ) {}
}

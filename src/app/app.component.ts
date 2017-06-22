/**
 * Created by abreneli on 30/06/2016.
 */
import {Component, ViewEncapsulation} from '@angular/core';
import {InterventionMainDisplay} from './intervention/main_display/intervention.main_display';
import {AppBar} from './app_bar/app_bar';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'intervention-app',
    templateUrl: './app.component.html'
})

export class InterventionAppComponent { 

    constructor( private  route: ActivatedRoute ) {}
}

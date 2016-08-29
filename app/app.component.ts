/**
 * Created by abreneli on 30/06/2016.
 */
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES}  from '@angular/router';

import {InterventionMainDisplay} from './intervention/main_display/intervention.main_display';
import {AppBar} from './app_bar/app_bar';

@Component({
    selector: 'intervention-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES, InterventionMainDisplay, AppBar],
})

export class InterventionAppComponent { }

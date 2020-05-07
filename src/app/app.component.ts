/**
 * Created by abreneli on 30/06/2016.
 */
import {Component, OnInit} from '@angular/core';
import { PushNotificationService } from './services/push-notification.service';

@Component({
    moduleId: module.id,
    selector: 'intervention-app',
    templateUrl: './app.component.html'
})

export class InterventionAppComponent implements OnInit {

    constructor( private  _pushNotif : PushNotificationService ) {}

    ngOnInit()
    {
      this._pushNotif.init();
    }

}

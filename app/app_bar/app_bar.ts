/**
 * Created by abreneli on 04/07/2016.
 */

import {Component, OnInit} from '@angular/core';
import { ApplicationService } from '../application.service';

@Component({
    selector: 'app-bar',
    templateUrl: 'app/app_bar/app_bar.html',
    styleUrls:  ['app/app_bar/app_bar.css']
})

export class AppBar {

    constructor( private appService: ApplicationService )
    {
    }

    m1State() : string {
        return this.appService.m1Connected ? 'connected' : 'disconnected';

    }

    plottiState() : string {
        return this.appService.plottiConnected ? 'connected' : 'disconnected';

    }

    public ConnectionPanelDisplayed: boolean = false;

    public TSLogin : string = "";
    public TSPassword : string = "";

    connect() : void
    {
        if ( this.appService.connect( this.TSLogin, this.TSPassword ) )
            this.ConnectionPanelDisplayed = false;
    }

    disconnect() : void
    {
        if ( this.appService.disconnect() )
            this.ConnectionPanelDisplayed = false;
    }

    clickConnectionPanel() : void
    {
        this.ConnectionPanelDisplayed = !this.ConnectionPanelDisplayed;
    }
}
/**
 * Created by abreneli on 04/07/2016.
 */

import {Component, OnInit} from '@angular/core';
import { InterventionService } from '../services/intervention.service';

@Component({
    moduleId: module.id,
    selector: 'app-bar',
    templateUrl: './app_bar.html',
    styleUrls:  ['./app_bar.css']
})

export class AppBar {

    constructor( public interService: InterventionService )
    {
    }

    m1State() : string {
        return this.interService.m1Connected ? 'connected' : 'disconnected';

    }

    plottiState() : string {
        return this.interService.plottiConnected ? 'connected' : 'disconnected';

    }

    get connectedState() : string {
        return this.interService.Connected ? 'connected' : 'disconnected';
    }

    get connectedLabel() : string {
        return this.interService.Connected ? 'Connected' : 'Disconnected';
    }

    public ConnectionPanelDisplayed: boolean = false;

    public TSLogin : string = "";
    public TSPassword : string = "";

    connect() : void
    {
        if ( this.interService.connect( this.TSLogin, this.TSPassword ) )
            this.ConnectionPanelDisplayed = false;
    }

    disconnect() : void
    {
        if ( this.interService.disconnect() )
            this.ConnectionPanelDisplayed = false;
    }

    clickConnectionPanel() : void
    {
        this.ConnectionPanelDisplayed = !this.ConnectionPanelDisplayed;
    }
}
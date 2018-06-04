/**
 * Created by abreneli on 04/07/2016.
 */

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ConnectionStatus } from '../services/connection.status';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';
import { InterventionService } from '../services/intervention.service';

@Component({
    moduleId: module.id,
    selector: 'app-bar',
    templateUrl: './app_bar.html',
    styleUrls:  ['./app_bar.css']
})

export class AppBar {

    @Output() dispNavEvent = new EventEmitter<Event>();

    private _connected : boolean;

    constructor( public connectionStatus: ConnectionStatus, public interService: InterventionService, private cd: ChangeDetectorRef  )
    {
        // inialisation de l'affichage du statut de connexion
        this._connected = connectionStatus.connected;

        // inscription aux changements de statuts de connexion
        connectionStatus.connectedStatus$.subscribe( (conn) => { 
            this._connected = conn;
            cd.detectChanges(); } )
    }

    public onClickListButton() : void {
        this.dispNavEvent.emit();
    }

    get ErrorMessages() : [number, string][] {
        return this.connectionStatus.errorMessages;
    }

   
    // m1State() : string {
    //     return this.connectionStatus.m1Connected ? 'connected' : 'disconnected';

    // }

    // plottiState() : string {
    //     return this.connectionStatus.plottiConnected ? 'connected' : 'disconnected';

    // }

    get connectedState() : string {
        return this._connected ? 'connected' : 'disconnected';
    }

    get connectedLabel() : string {
        return this._connected ? 'Connected' : 'Disconnected';
    }

    get connected() : boolean {
        return this._connected;
    }

    closeError( id : number ) : void {
        this.connectionStatus.removeErrorMessage( id );
        this.cd.detectChanges();
    }
}
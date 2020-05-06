/**
 * Created by abreneli on 04/07/2016.
 */

import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ConnectionStatus } from '../services/connection.status';
import { environment } from '../../environments/environment';

@Component({
    moduleId: module.id,
    selector: 'app-bar',
    templateUrl: './app_bar.html',
    styleUrls:  ['./app_bar.css']
})

export class AppBar {

    @Output() dispNavEvent = new EventEmitter<Event>();

    private _connected : boolean;

    constructor( public _connStatus: ConnectionStatus, private _cd: ChangeDetectorRef )
    {
        // inialisation de l'affichage du statut de connexion
        this._connected = _connStatus.connected;


        // inscription aux changements de statuts de connexion
        _connStatus.connectedStatus$.subscribe( (conn) => {
            this._connected = conn;
            _cd.detectChanges(); } )
    }

    public onClickListButton() : void {
        this.dispNavEvent.emit();
    }

    get ErrorMessages() : [number, string][] {
        return this._connStatus.errorMessages;
    }

    get serviceVersion() : string
    {
      return this._connStatus.serviceVersion;
    }

    get clientVersion() : string
    {
      return environment.version;
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
        this._connStatus.removeErrorMessage( id );
        this._cd.detectChanges();
    }
}

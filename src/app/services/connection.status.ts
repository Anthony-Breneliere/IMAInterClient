import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { resolve } from 'path';
import { reject } from 'lodash';
import { sign } from 'crypto';

@Injectable()
export class ConnectionStatus 
{
    private _errorMessages: [number, string][] = [];
    private _connected: boolean = false;
    private _connectedStatusSource = new Subject<boolean>();
    private _m1Connected: boolean = false;
    private _plottiConnected: boolean = false;
    private _username: string;
    private reconnectionResolve: () => void;
    private _messNumber: number = 0;
    private _serviceVersion: string = "Inconnue";

    private _connection: HubConnection;
    public get HubConnection() { return this._connection };

    private _connectedUsers: string[]= [];
    public get ConnectedUsers() { return this._connectedUsers };

    public get errorMessages(): [number, string][] { return this._errorMessages; }
    public addErrorMessage(mess: string) 
    {
        console.error(this._errorMessages);
        this._errorMessages.push([++this._messNumber, mess])
    }

    public removeErrorMessage(id: number) { this._errorMessages = this._errorMessages.filter(m => m[0] != id) }
    private clearErrorMessages() { this._errorMessages = []; this._messNumber = 0; }
    public get m1Connected(): boolean { return this._m1Connected; }
    public set m1Connected(value: boolean) { this._m1Connected = value; }
    public get plottiConnected(): boolean { return this._plottiConnected; }
    public set plottiConnected(value: boolean) { this._plottiConnected = value; }
    public get login() { return this._username; }
    public get serviceVersion() { return this._serviceVersion; }

    public promiseHubScriptLoaded: Promise<any>;
    connectedStatus$ = this._connectedStatusSource.asObservable();

    constructor(private httpClient: HttpClient) 
    {
        this.loadHubsScript();
    }

    // accesseurs publics:
    get connected(): boolean 
    {
        return this._connected;
    }

    set connected(value: boolean) 
    {
        this._connected = value;
        this._connectedStatusSource.next(value);
    }

    private isHubScriptLoaded: boolean = false;

    /**
     * Cette m??thode construit la connexion ?? l'IMAInterHub et initialise les callback associ??
     */
    private loadHubsScript(): void 
    {
        console.log('Cr??ation de la promesse promiseHubScriptLoaded');

        this.promiseHubScriptLoaded = new Promise((resolve, reject) => {
            try {
                console.debug('execution de la promesse de connexion au hub');
                this.isHubScriptLoaded = true;
                this._connection = new signalR.HubConnectionBuilder()
                    .withUrl(environment['server'] + "/imaintersignalr")
                    .configureLogging(signalR.LogLevel.None)
                    .build();

                this.initHubCallbacks();
                resolve();
            }
            catch (error) {
                this.isHubScriptLoaded = false;
                console.error(`Connection au hub impossible (${error})`);
                this.addErrorMessage(`Connection au hub impossible (${error})`);
                reject(this.errorMessages);
            }
        });
    }



    /**
     * v??rification de l'utilisateur logu??
     * @param name
     */
    public operatorNameEqual(name: string): boolean 
    {
        return this._username && name && name.toLowerCase() == this._username.toLowerCase();
    }

    /**
     * affectation des callbacks aux fonctions du hubproxy. Ce sont les callbacks qui sont
     * appel??es lorsque le serveur broadcast des informations.
     */
    private initHubCallbacks(): void 
    {
        this._connection.onclose(async (error?: Error) => 
        {
            this.connected = false;

            if (error) 
            {
                this.addErrorMessage("Connection onclose error: " + error.message);
                console.log(`erreur rencontr?? durant la deconnection ${Error}`);
            }
            else 
            {
                console.log("L'??tat de la connexion a chang?? ?? l'??tat Disconnected");
            }

            this.start();
        });

        this._connection.onreconnecting((error?: Error) => 
        {
            this.connected = false;

            if (error) 
            {
                this.addErrorMessage("Connection onreconnecting error: " + error.message);
                console.log(`erreur rencontr?? durant la reconnection ${Error}`);
            }
            else 
            {
                console.log("L'??tat de la connexion a chang?? ?? l'??tat Connecting");
            }
        });

        this._connection.onreconnected((connectionId?: string) => 
        {
            this.connected = true;

            if (connectionId) 
            {
                console.log(`L'??tat de la connexion a chang?? ?? l'??tat Connected ${connectionId}`);
            }
            else 
            {
                console.log("L'??tat de la connexion a chang?? ?? l'??tat Connected");
            }
        });


        this._connection.on('ErrorMessage', (message: string) => 
        {
            this.addErrorMessage(message);
        });

        this._connection.on('SendUserName', (userName: string) => 
        {
            this._username = userName;

            console.log("Connexion en tant qu'utilisateur '" + this._username + "'");
        });

        this._connection.on('SendConnectedUsers', (connectedUsers: string[]) => 
        {
            console.log("R??cup??ration de la liste des utilisateurs connect??s '" + connectedUsers + "'");
            this._connectedUsers = connectedUsers;            
        });
    }

    public start(): Promise<any> {
        let startPromise = new Promise<void>((resolve, reject) => 
        {

            // attention le d??marrage du serveur doit se faire APRES l'enregistrement des callbacks !
            this.startHubConnection().then(() => {
                if (this._connection.state === signalR.HubConnectionState.Connected) 
                {
                    this.connected = true;

                    this._connection.invoke('GetServiceVersion')
                        .then((version : string) =>
                        {
                            this._serviceVersion = version;
                            console.log("Version du service: " + version);
                            resolve();
                        })
                        .catch( ( e : any ) => 
                        {
                            this.addErrorMessage( `Impossible de r??cup??rer la version du service. ${e}` );
                            reject(e);
                        })
                }
                resolve();
            })
                .catch(err => {
                    this.connected = false;
                    this.addErrorMessage(`Connexion au serveur ${environment['server']}/imaintersignalr impossible + ${err}`);
                    reject(err);
                })
        });

        return startPromise;
    }

    /**
     * Promesse gerant la reconnexion automatique au hub
     */
    private async startHubConnection(): Promise<any> 
    {
        let starthubPromise = new Promise<void>((resolve) => 
        {
            (async () => 
            {
                while (this._connection.state !== signalR.HubConnectionState.Connected) 
                {
                    try 
                    {
                        await this._connection.start();
                    } catch
                    {
                        console.log('Impossible de d??marrer la connexion');
                        setTimeout(null, 1000);
                    }
                }
                resolve();
            })();
        });
        return starthubPromise;
    }

    /**
     * Retourne une promesse de reconnexion
     */
    public waitForReconnection(): Promise<any> 
    {
        let reconnectionPromise = new Promise<void>((resolve) => 
        {
            (async () => {
                while (!this.connected)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                
                resolve();
            })();
        });

        // on retourne la promesse afin de pouvoir enchaine les promesses
        return reconnectionPromise;
    }

    /**
     * Retourne vrai si l'utilisateur logu?? est un admin
     * ( remarque: las liste des admins est pour l'instant stock??e dans le client)
     */
    public isAdmin(): boolean 
    {
        let admins = environment['admins'];
        if (admins.find(e => e == this.login))
            return true;

        return false;
    }
}

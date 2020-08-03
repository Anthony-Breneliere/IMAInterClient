import { Subject }    from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Injectable }    from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HubConnection } from '@microsoft/signalr';
import { resolve } from 'path';
import { reject } from 'lodash';

@Injectable()
export class ConnectionStatus
{
    private _errorMessages: [number, string][] = [];
    private _connected: boolean = false;
    private _connectedStatusSource = new Subject< boolean >();
    private _m1Connected: boolean = false;
    private _plottiConnected: boolean = false;
    private _username : string;
    private reconnectionResolve : () => void;
    private _messNumber : number = 0;
    private _serviceVersion : string = "Inconnue";

    private _connection : HubConnection;
    public get HubConnection() { return this._connection };

    public get errorMessages() : [number, string][] { return this._errorMessages; }
    public addErrorMessage( mess : string ) { 
        // TODO voir pourquoi ce console.error genere des erreurs
        console.error( this._errorMessages ); 
        this._errorMessages.push( [++this._messNumber, mess] ) 
    }
    public removeErrorMessage( id : number ) { this._errorMessages = this._errorMessages.filter( m => m[0] != id) }
    private clearErrorMessages() { this._errorMessages = []; this._messNumber = 0; }
    public get m1Connected() : boolean { return this._m1Connected;  }
    public set m1Connected( value: boolean ) { this._m1Connected = value;  }
    public get plottiConnected() : boolean { return this._plottiConnected;  }
    public set plottiConnected( value: boolean ) { this._plottiConnected = value;  }
    public get login() { return this._username; }
    public get serviceVersion() { return this._serviceVersion; }

    public promiseHubScriptLoaded : Promise< any >;
    connectedStatus$ = this._connectedStatusSource.asObservable();

    constructor(private httpClient: HttpClient)
    {
         this.loadHubsScript();
    }

    // accesseurs publics:
    get connected() : boolean {
        return this._connected;
    }

    set connected( value: boolean )
    {
          this._connected = value;
          this._connectedStatusSource.next( value );
    }

    private isHubScriptLoaded : boolean = false;


    //TODO GMA méthode a renommer
    /**
     * Cette méthode exécute le script de génération des hubs proxys signalR. Ce script
     * est est généré par le serveur SignalR, il faut donc l'appeler dynamiquement.
     */
    private loadHubsScript() : void
    {
        console.log('Création de la promesse promiseHubScriptLoaded');

        this.promiseHubScriptLoaded = new Promise((resolve,reject) => {
            try {
                console.debug('execution de la promesse de connexion au hub');
                this.isHubScriptLoaded = true;
                this._connection = new signalR.HubConnectionBuilder()
                .withUrl(environment['server'] + "/imaintersignalr")
                //TODO GMA supprimer configureLogging avant la Mise en recette
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();

                this.initHubCallbacks();
                resolve();
            }
            catch(error){
                this.isHubScriptLoaded = false;
                console.error(`Connection au hub impossible (${error})`);
                this.addErrorMessage( `Connection au hub impossible (${error})` );
                reject(this.errorMessages);
            }            
        });
    }



    /**
     * vérification de l'utilisateur logué
     * @param name
     */
    public operatorNameEqual( name: string ) : boolean
    {
        return this._username && name && name.toLowerCase() == this._username.toLowerCase();
    }

    /**
     * affectation des callbacks aux fonctions du hubproxy. Ce sont les callbacks qui sont
     * appelées lorsque le serveur broadcast des informations.
     */
    private initHubCallbacks() : void
    {
        this._connection.onclose((error?: Error) =>
        {
            this.connected = false;

            if(error)
            {
                this.addErrorMessage( "Connection onclose error: " + error.message );
                console.log(`erreur rencontré durant la deconnection ${Error}`);
            }
            else{
                console.log("L'état de la connexion a changé à l'état Disconnected");
            }
        });

        this._connection.onreconnecting((error?: Error) =>
        {
            this.connected = false;

            if(error)
            {
                this.addErrorMessage( "Connection onreconnecting error: " + error.message );
                console.log(`erreur rencontré durant la reconnection ${Error}`);
            }
            else{
                console.log("L'état de la connexion a changé à l'état Connecting");
            }
        });

        this._connection.onreconnected((connectionId?: string) =>
        {
            this.connected = true;

            if(connectionId)
            {
                console.log(`L'état de la connexion a changé à l'état Connected ${connectionId}`);
            }
            else{
                console.log("L'état de la connexion a changé à l'état Connected");
            }
        });

        //TODO GMA NOW
    //     let signalRUrl : string = environment['server'] + "/imaintersignalr";
    //     let connection = jQuery.connection;
    //     let hub = connection.hub;

    //     hub.url = signalRUrl;
    //     hub.logging = true;

    //     hub.error( (error) => {
    //         this.addErrorMessage( "Connection error: " + error.message );
    //     });

    //     hub.connectionSlow( () => {
    //         console.log('We are currently experiencing difficulties with the connection.');
    //     });

    //     hub.stateChanged( ( change: SignalR.StateChanged ) => {
    //         console.log("L'état de la connexion a changé de l'état " + change.oldState + " à l'état " + change.newState + " (Connecting = 0, Connected, Reconnecting, Disconnected)");

    //         if ( change.newState == 1 )
    //         {
    //             this.connected = true;

    //             this.clearErrorMessages();

    //             // s'il existe une promesse de reconnection, alors cette promesse est tenue:
    //             if ( this.reconnectionResolve )
    //                 this.reconnectionResolve();

    //             this._serviceVersion = this.proxyServer.getServiceVersion().done( version => {
    //               this._serviceVersion = version;
    //               console.log("Version du service: " + version);
    //             } ).fail( e => {
    //               this.addErrorMessage( `Impossible de récupérer la version du service` );
    //             });

    //         }
    //         else
    //             this.connected = false;
    //     });

    //     this.proxy = connection['iMAInterHub'];

        this._connection.on('ErrorMessage',( message : string ) =>
        {
            this.addErrorMessage( message );
        });

        this._connection.on('SendUserName',( userName : string ) =>
        {
            this._username = userName;

            console.log( "Connection en tant qu'utilisateur '" + this._username + "'");
        });
    }

    public start() : Promise<any>
    {
        let startPromise = new Promise( (resolve,reject) => {

             // attention le démarrage du serveur doit se faire APRES l'enregistrement des callbacks !
            this._connection.start().then(() => {
                if (this._connection.state === signalR.HubConnectionState.Connected)
                {
                    this.connected = true;
                }
                resolve();
            })
            .catch(err => {
                this.connected = false;
                this.addErrorMessage( `Connexion au serveur ${environment['server']}/imaintersignalr impossible + ${err}` ); 
                reject( err );
            })
        });

        return startPromise;
    }

    /**
     * Retourne une promesse de reconnexion
     */
    public waitForReconnection() : Promise<any>
    {
        let reconnectionPromise = new Promise( (resolve, reject) =>
        {
            if ( ! this.connected )
                this.reconnectionResolve = resolve;
            else
                resolve();
        } );

        // on retourne la promesse afin de pouvoir enchaine les promesses
        return reconnectionPromise;
    }

    /**
     * Retourne vrai si l'utilisateur logué est un admin
     * ( remarque: las liste des admins est pour l'instant stockée dans le client)
     */
    public isAdmin() : boolean
    {
        let admins = environment['admins'];
        if ( admins.find( e => e == this.login ))
            return true;

        return false;
    }
}

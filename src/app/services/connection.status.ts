import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { Connection, Headers, Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Injectable }    from '@angular/core';

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
    
    public get errorMessages() : [number, string][] { return this._errorMessages; }
    public addErrorMessage( mess : string ) { console.log( this._errorMessages ); this._errorMessages.push( [++this._messNumber, mess] ) }
    public removeErrorMessage( id : number ) { this._errorMessages = this._errorMessages.filter( m => m[0] != id) }
    public get proxyClient() { return this.proxy.client };
    public get proxyServer() { return this.proxy.server };
    public get m1Connected() : boolean { return this._m1Connected;  }
    public set m1Connected( value: boolean ) { this._m1Connected = value;  }
    public get plottiConnected() : boolean { return this._plottiConnected;  }
    public set plottiConnected( value: boolean ) { this._plottiConnected = value;  }
    public get login() { return this._username; }

    promiseHubScriptLoaded : Promise< any >;
    connectedStatus$ = this._connectedStatusSource.asObservable();

    constructor(private http: Http)
    {
        console.log("Constrcutor ConnectionStatus")
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

    // C'est le proxy sur le hub SignalR, il permet d'appeler des méthodes coté server et au serveur
    // d'appeler des méthodes sur tous les clients.
    private proxy : any = null;

    /**
     * Cette méthode exécute le script de génération des hubs proxys signalR. Ce script
     * est est généré par le serveur SignalR, il faut donc l'appeler dynamiquement.
     */
    private loadHubsScript() : void
    {
        let hubScriptUrl : string = environment['server'] + "/imaintersignalr/hubs";

        console.log(`Récupération du script signalR: ${hubScriptUrl}`);

        this.promiseHubScriptLoaded = new Promise<any>( (resolve, reject) => {
            jQuery.getScript(hubScriptUrl, () =>  {
                this.isHubScriptLoaded = true;
                this.initHubCallbacks();
                resolve();
            })
            .fail( (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                this.isHubScriptLoaded = false;
                this.addErrorMessage( `Connection à l'url ${hubScriptUrl} impossible (${errorThrown} ${xhr.status})` );
                reject( this.errorMessages );
            });
        } );
    }



    /**
     * vérifiécation de l'utilisateur logué
     * @param name 
     */
    public operatorNameEqual( name: string ) : boolean
    {
        // console.log("name: " + name + " login:" + this.login);
        return this._username && name && name.toLowerCase() == this._username.toLowerCase();
    }

    /**
     * affectation des callbacks aux fonctions du hubproxy. Ce sont les callbacks qui sont
     * appelées lorsque le serveur broadcast des informations.
     */
    initHubCallbacks() : void
    {
        let signalRUrl : string = environment['server'] + "/imaintersignalr";
        let connection = jQuery.connection;
        let hub = connection.hub;

        hub.url = signalRUrl;
        hub.logging = true;

        hub.error( (error) => {
            this.addErrorMessage( "Connection error: " + error.message );
        });

        hub.connectionSlow( () => {
            console.log('We are currently experiencing difficulties with the connection.');
        });

        hub.stateChanged( ( change: SignalR.StateChanged ) => { 
            console.log("L'état de la connexion a changé de l'état " + change.oldState + " à l'état " + change.newState + " (Connecting = 0, Connected, Reconnecting, Disconnected)");
            
            if ( change.newState == 1 )
            {
                this.connected = true;

                // s'il existe une promesse de reconnection, alors cette promesse est tenue:
                if ( this.reconnectionResolve )
                    this.reconnectionResolve();
            }
            else
                this.connected = false;
        });

        this.proxy = connection['iMAInterHub'];

        this.proxy.client.errorMessage = ( message : string ) =>
        {
            this.addErrorMessage( message );
        }

        this.proxy.client.sendUsername = ( userName : string ) =>
        {
            this._username = userName;
        }
    }

    public start() : Promise<any>
    {
        let hub = jQuery.connection.hub;

        let startPromise = new Promise( (resolve, reject) => {

            // attention le démarrage du serveur doit se faire APRES l'enregistrement des callbacks ! 
            hub.start()
                .done( () => {
                    console.log("Connecté à " + hub.url + ", transport = " + hub.transport.name 
                    + ", connection id = " + hub.id );  resolve();
                })
                .fail( ( e ) => {
                    this.addErrorMessage( `Connexion au serveur ${hub.url} impossible + ${e}` ); reject( e );
                } );
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
}
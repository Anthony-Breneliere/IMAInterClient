
/**
 * Created by abreneli on 04/07/2016.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Intervention } from '../model/Intervention';
import { InterventionState } from '../model/Intervention_state';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { OrigineFiche, TypeFiche, MotifIntervention, Trajet, TypePresence, DepotBonIntervention, Etat } from '../model/enums';
import Collections = require('typescript-collections');
import {Rapport} from "../model/rapport";
import {Alarme} from "../model/alarme";
import {RapportPresence} from "../model/rapport_presence";
import {RapportVerifications} from "../model/rapport_verifications";

@Injectable()
export class InterventionService {

    private runningInterventionsDico : Collections.Dictionary<number, Intervention> = new Collections.Dictionary<number, Intervention>();
    private interventionsStateDico : Collections.Dictionary<number, InterventionState> = new Collections.Dictionary<number, InterventionState>();

    private interventionsAppUrl = 'app/interventions';  // URL to web api
    
    private password: string;
    private _m1Connected: boolean = false;
    private _plottiConnected: boolean = false;
    private config : any;

    public login: string;

    // accesseurs publics:
    get Connected() : boolean { return jQuery.connection.hub.state == 1;  }
    get Logged() : boolean { return this.login != null;  }

    get m1Connected() : boolean { return this._m1Connected;  }
    set m1Connected( value: boolean ) { this._m1Connected = value;  }

    get plottiConnected() : boolean { return this._plottiConnected;  }
    set plottiConnected( value: boolean ) { this._plottiConnected = value;  }

    // le service expose une intervention sélectionnée, les composants intéressés peuvent s'enregistrer auprès de cette intervention sélectionnée
    // c'est généralement une intervention recherchée en particulier est insérée:
    public selectedIntervention: Observable<Array<Intervention>> = new Observable<Array<Intervention>>();

    // C'est le proxy sur le hub SignalR, il permet d'appeler des méthodes coté server et au serveur
    // d'appeler des méthodes sur tous les clients.
    private proxy : any = null;

    /**
     * Constructeur, il charge le fichier de config qui contient l'adresse de connexion
     * au serveur.
     */
    constructor(private http: Http) {

        this.http.get("imainter.json").toPromise().then( response => { this.onConfigFileLoaded ( response ); } );
     }
     
     /**
      * Lecture du fichier de config, éventuellement des données de démo et assignation des callbacks
      * des méthode du hub.
      */
     private onConfigFileLoaded( response : any ) : void {
        this.config = response.json();
        console.log ( this.config );

        if ( this.useDemoData )
            this.getDemoData();
        
        this.loadHubsScript();
     }

    private isScriptLoaded : boolean = false;
    private scriptLoaded : () => void;

    /**
     * Cette méthode exécute le script de génération des hubs proxys signalR. Ce script
     * est est généré le serveur SignalR, il faut donc l'appeler dynamiquement.
     */
    private loadHubsScript() :void
    {
        let hubScriptUrl : string = this.config['imainter']['server'] + "/imaintersignalr/hubs";
        jQuery.getScript(hubScriptUrl, () => {
            this.isScriptLoaded = true;
            if ( this.scriptLoaded != null )
                this.scriptLoaded();
            this.initHubCallbacks();
        });
    }

    /**
     * Retourn vrai si on est connecté au server
     */
    public isServerConnected(): boolean
    {
        let isConnected: boolean = ! jQuery.connection.hub.disconnected;
        return isConnected;
    }

    private connectionDetected : () => void;

    /**
     * affectation des callbacks aux fonctions du hubproxy. Ce sont les callbacks qui sont
     * appelées lorsque le serveur broadcast des informations.
     */
    initHubCallbacks() : void
    {
        let signalRUrl : string = this.config['imainter']['server'] + "/imaintersignalr";
        let connection = jQuery.connection;
        let hub = connection.hub;

        hub.url = signalRUrl;
        hub.logging = true;
        hub.error( (error) => {      console.error('SignalR error: ' + error);     });
        hub.connectionSlow( () => {
            console.log('We are currently experiencing difficulties with the connection.')
        });
        hub.stateChanged( ( change: SignalR.StateChanged ) => { 
            console.log("L'état de la connexion a changé de l'état " + change.oldState + " à l'état " + change.newState + " (Connecting = 0, Connected, Reconnecting, Disconnected)");

            // s'il existe une promesse de reconnection, alors cette promesse est tenue:
            if ( change.newState == 1  )
                this.reconnectionResolve();
        });
        

        this.proxy = connection['iMAInterHub'];

        // attention le démarrage du serveur doit se faire APRES l'enregistrement des callbacks ! 
        hub.start() 
        .done( () => {
            console.log("Connecté, transport = " + hub.transport.name + ", connection id = " + hub.id );

            // chargement automatique des interventions en cours à la connection:
            this.loadCurrentInterventionList();
        })
        .fail( ( e ) => {
            console.error('Connexion au serveur impossible.');
            console.error( e );
        } );
    }

    /** Cette fonction charge les interventions qui sont en cours
     * Toutes les données des interventions ne sont pas chargés: seulement les données essentielles.
     * Remarque: cette méthode est automatiquement appelée à la connection.
     */  
    public loadCurrentInterventionList() : void
    {
        this.proxy.server.queryCurrentFI()
            .done( (newInterventions : Intervention[]) => this.onReceiveInterventionList( newInterventions ) )
            .fail( ( e : any ) => {
            console.error('Erreur lors de la récupération des interventions courrantes.');
            console.error( e );
        } );
      
    }

    /**
     * Arrivée d'un lot d'interventions depuis le serveur
     */
    public onReceiveInterventionList( newInterventions : Intervention[] )
    {
        console.log( newInterventions.length + " interventions reçues.");

        let updatedCount : number = 0;
        let createdCount : number = 0;
    
        // ajout des interventions au dico:
        for( let inter of newInterventions )
        {
            let newIntervention = new Intervention( inter );
            if ( null == this.onReceiveInterventionDetails( newIntervention, false ) )
                ++createdCount;
            else
                ++updatedCount;
        }

        if ( updatedCount > 0 )
            ( updatedCount + " interventions mise à jour.");
        if ( createdCount > 0 )
            console.log( createdCount + " interventions créées.");
    }

    public connect( login: string, password: string ) : boolean
    {
        this.login = login;
        this.password = password;

        // vérification de la validité du login / password
        if( this.login && this.login != "" && this.password && this.password != "" )
        {
            // TODO: se connecter au serveur
            this.m1Connected = true;
            this.plottiConnected = true;

            return true;
        }

        return false;
    }

    public disconnect() : boolean
    {
        this.m1Connected = false;
        this.plottiConnected = false;
        this.login = null;

        return true;
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


    getInterventions(): Intervention[]
     {
        if ( this.config && this.login && this.config.imainter.useDemoData == true )
            return this.demoData.InterventionList;

        if ( this.Connected )
        {
            let interventions = this.runningInterventionsDico.values();
            return interventions;
        }
        else 
            return [];
    }

    get MyInterventions(): Intervention[] {
        var currentInterventions = this.getInterventions();

        let interList = currentInterventions.filter(
            (i: Intervention) => { return this.operatorNameEqual( i.Operateur ) && i.Etat != Etat.Close } );
        
        return interList;
    }

    get OtherInterventions(): Intervention[] {
        let otherInterventions = this.getInterventions().filter(
            (i: Intervention) => { return (i.Operateur == null || !this.operatorNameEqual( i.Operateur )) && i.Etat != Etat.Close } );
        return otherInterventions;
    }

    get CloseInterventions(): Intervention[] {
        return this.getInterventions().filter(
            (i: Intervention) => { return i.Etat == Etat.Close } );
    }

    private operatorNameEqual( name: string ) : boolean
    {
        // console.log("name: " + name + " login:" + this.login);
        return this.login != null && name != null && name.toLowerCase() == this.login.toLowerCase();
    }

    /**
     * Permet de récupérer tout le détail d'une intervention 
     */
    public getIntervention( numeroFiche : number ) : Promise<Intervention>
    {
        if ( this.useDemoData )
        {
            // on retourne l'intervention 1 du fichier de démo
            this.onReceiveInterventionDetails( this.demoData.Intervention1, true );
            return null;
        }
        
        if ( this.Connected )
        {
            return this.getInterventionFromServer( numeroFiche );
        }
    }

    private reconnectionResolve : () => void;

    /**
     * Attend la prochaine reconnexion
     */
    public waitForReconnection() : Promise<any>
    {
        let reconnectionPromise = new Promise( (resolve, reject) =>
        {
            if ( ! this.Connected )
                this.reconnectionResolve = resolve;
            else
                resolve();
        } );

        // on retourne la promesse afin de pouvoir enchaine les promesses
        return reconnectionPromise;
    }

    /** 
     * Charge une intervention
     * numFI : numéro de fiche
     */
    public loadIntervention( numFI : number ) : Promise<Intervention>
    {
        let loadInterventionPromise = this.waitForReconnection().then( () =>
        {
            return this.getInterventionFromServer( numFI );
        });
   
        return loadInterventionPromise;
    }

    public getInterventionFromServer( numFI : number ) : Promise<Intervention>
    {
        let getInterPromise = new Promise<Intervention>( (resolve, reject ) =>
        {
            this.proxy.server.getIntervention( numFI )
                .done( (interventionWithDetails : Intervention) => 
                {
                    this.onReceiveInterventionDetails( interventionWithDetails, true );
                    resolve(interventionWithDetails);
                } )
                .fail( ( e : any ) => {
                    console.error("Erreur lors de la récupération de l'intervention " + numFI);
                    console.error( e );
                    reject(e);
                })
        });
        return getInterPromise;
    }

    /**
     * Retourne une fiche d'intervention chargée, cela ne déclenche pas de chargement auprès du serveur
  
    public getInterventionLoaded( numeroFiche: number ) : Intervention[]
    {
        let fiche =  this.runningInterventionsDico.getValue( numeroFiche );
        return [fiche];
    }
   */
    /**
     * Appelé lorsqu'une nouvelle intervention a été reçu par le service.
     */
    public onReceiveInterventionDetails( receviedInter: Intervention, fullIntervention : boolean) : Intervention
    {
        // on log l'intervention que si elle est complete
        if ( fullIntervention ) 
            console.log( receviedInter );

        let updatedInter : Intervention = null;
        let interState : InterventionState;

        if ( this.runningInterventionsDico.containsKey( receviedInter.Id ) )
        {  
            // on met à jour l'intervention que nous avons actuellement en mémoire (elle n'est pas remplacée)
            let updatedInter = this.runningInterventionsDico.getValue( receviedInter.Id );
            Object.assign( updatedInter, receviedInter );
            
            // état de l'intervention
            interState = this.interventionsStateDico.getValue( receviedInter.Id );
            interState.Loaded = interState.Loaded || fullIntervention;
        }
        else
        {
            interState = new InterventionState();
            interState.Loaded = interState.Loaded || fullIntervention;
            interState.Selected = false;
            interState = this.interventionsStateDico.setValue( receviedInter.Id, interState );

            // ajout de l'intervention en mémoire dans le dictionnaire
            this.runningInterventionsDico.setValue( receviedInter.Id, receviedInter );
        }

        return updatedInter;
    }

    /**
     * Permet de récupérer l'état d'une intervention chargée. Il s'agit d'une donnée interne au client.
     */
    public getInterventionState( id: number )   : InterventionState
    {
        return this.interventionsStateDico.getValue( id );
    }

    /**
     * Fonction de chargement des données de démo quand c'est activé dans le 
     */
    private demoData: any;

    private get useDemoData() : boolean
    {
        return this.config && this.config.imainter && this.config.imainter.useDemoData == true;
    }

    /**
     * Récupère les données de démo dans le fichier de démo json
     */
    private getDemoData()
    {
        this.http.get("demoData.json").toPromise()
        .then( response => {
            this.demoData = response.json();
        }) 
        .catch( reason => console.log(reason));
    }

 }



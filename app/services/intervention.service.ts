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
import * as Collections from 'typescript-collections';
import { forEach } from 'typescript-collections/dist/lib/arrays';
import {Rapport} from "../model/rapport";
import {Alarme} from "../model/alarme";
import {RapportPresence} from "../model/rapport_presence";
import {RapportVerifications} from "../model/rapport_verifications";
import { ITypeMainCourante } from "../model/type_maincour";
import { MainCourante } from "../model/main_courante";
import { Subject }    from 'rxjs/Subject';
import * as Lodash from 'lodash';
import 'signalr'

@Injectable()
export class InterventionService {

    private loadedInterventionsDico : Collections.Dictionary<number, Intervention> = new Collections.Dictionary<number, Intervention>();
    private interventionsStateDico : Collections.Dictionary<number, InterventionState> = new Collections.Dictionary<number, InterventionState>();

    private interventionsAppUrl = 'app/interventions';  // URL to web api
    
    private password: string;
    private _m1Connected: boolean = false;
    private _plottiConnected: boolean = false;
    private config : any;

    public login: string;

    // liste des changements
    private newInterSource = new Subject< Intervention >();
    private updatesSource = new Subject< [ Intervention, string ] >();

    // observables stream:
    newInter$ = this.newInterSource.asObservable();
    update$ = this.updatesSource.asObservable();

    // todo: attente d'une fonction d'ESI permettant de récupére le used Id à partir de l'opérateur
    private userId: number = 9886433; 

    // on garde en mémoire la liste des types de mains courantes:
    public listeTypeMaincour : string[] = [];
    public listeM1LibelleDivers : string[] = [];

    // accesseurs publics:
    get Connected() : boolean { return jQuery && jQuery.connection && jQuery.connection.hub.state == 1;  }
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

        this.http.get("data/imainter.json").toPromise().then( response => { 
            this.onConfigFileLoaded ( response );
        } );

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
        jQuery.getScript(hubScriptUrl, () =>
        {
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
            if ( change.newState == 1 && this.reconnectionResolve )
                this.reconnectionResolve();
        });
   

        this.proxy = connection['iMAInterHub'];

        // Méthode appelée quand une intervention en cours a été mise à jour ou ajoutée
        this.proxy.client.newInterventionData = ( interventionData : Intervention ) =>
        {
            this.onReceiveInterventionData( interventionData, false );
        }

        this.proxy.client.newSearchResults = ( searchResults : Intervention[] ) =>
        {
            console.log( "Receiving search results:" );
            
            this.onReceiveInterventionList( searchResults );
        }

        // attention le démarrage du serveur doit se faire APRES l'enregistrement des callbacks ! 
        hub.start() 
            .done( () => {
                console.log("Connecté, transport = " + hub.transport.name + ", connection id = " + hub.id );

                this.onConnected();
            })
            .fail( ( e ) => {
                console.error('Connexion au serveur impossible.');
                console.error( e );
            } );
    }


    // fonction appelée au moment de la connection au serveur
    private onConnected() : void
    {
        // chargement automatique des interventions en cours à la connection:
        this.loadCurrentInterventionList();

        // chargement de la liste des types de mains courantes:
        this.loadTypeMaincour();

        // chargement de la liste des libelles divers du M1, car ils sont utilisés par certaiens maincourante generies:
        this.loadM1LibelleDivers();
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
            this.onReceiveInterventionData( inter, false );
        }

    }

    /**
     * Log au serveur avec le compte utilisateur et un mot de passe
     * @param login 
     * @param password 
     */
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

    /**
     * Délog au serveur, en fait on reste toujours connecté à ce dernier
     */
    public delog() : boolean
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

    /**
     * Fonction de récupération des interventions courantes
     */
    public getInterventions(): Intervention[]
     {
        if ( this.config && this.login && this.config.imainter.useDemoData == true )
            return this.demoData.InterventionList;

        if ( this.Connected )
        {
            let interventions = this.loadedInterventionsDico.values();
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
            (i: Intervention) => { return (! i.Operateur || !this.operatorNameEqual( i.Operateur )) && i.Etat != Etat.Close && i.Etat != Etat.Annulee } );
        return otherInterventions;
    }

    get CloseInterventions(): Intervention[] {
        var closed = this.getInterventions().filter(
            (i: Intervention) => { return i.Etat == Etat.Close || i.Etat == Etat.Annulee } );
        return closed;
    }

    private operatorNameEqual( name: string ) : boolean
    {
        // console.log("name: " + name + " login:" + this.login);
        return this.login && name && name.toLowerCase() == this.login.toLowerCase();
    }

    /**
     * Permet de récupérer tout le détail d'une intervention 
     */
    public getFullIntervention( numFI : number, siteId : number = null ) : Promise<Intervention>
    {
        if ( this.useDemoData )
        {
            // on retourne l'intervention 1 du fichier de démo
            this.onReceiveInterventionData( this.demoData.Intervention1, true );
            return null;
        }
        
        if ( this.Connected )
        {
            let interState = this.getInterventionState( numFI );
            if ( interState && interState.Loaded )
            {
                // intervention déjà chargée, on retourne la même intervention
                return new Promise<Intervention>( ( resolve ) => { return this.loadedInterventionsDico[ numFI ]; } );
            }
            else
            {   
                // récupération de l'intervention auprès des services de sa majesté IMAInter
                return this.getInterventionFromServer( numFI, siteId );
            }
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
    public connectAndLoadIntervention( numFI : number ) : Promise<Intervention>
    {
        let loadInterventionPromise = this.waitForReconnection().then( () =>
        {
            return this.getFullIntervention( numFI, null );
        });
   
        return loadInterventionPromise;
    }

    /**
     * @param numFI getInterventionFromServer
     */
    public getInterventionFromServer( numFI : number, siteId : number ) : Promise<Intervention>
    {
        let getInterPromise = new Promise<Intervention>( (resolve, reject ) =>
        {
            this.proxy.server.getIntervention( numFI, siteId )
                .done( (interventionWithDetails : Intervention) => 
                {
                    let interventionMerged = this.onReceiveInterventionData( interventionWithDetails, true );
                    resolve(interventionMerged);
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
     * Appelé lorsqu'une nouvelle intervention a été reçu par le service.
     */
    public onReceiveInterventionData( interData: Intervention, fullIntervention : boolean) : Intervention
    {
        // on logue les données reçues: l'intervention
        console.log( "Receiving " + (fullIntervention ? "FULL" : "PARTIAL") + " intervention data :" );
        console.log( interData);

        let updatedInter : Intervention = null;
        let interState : InterventionState;

        // cas de données d'intervention déjà chargée en mémoire
        if ( this.loadedInterventionsDico.containsKey( interData.Id ) )
        {  
            // on met à jour l'intervention que nous avons actuellement en mémoire (elle n'est pas remplacée)
            updatedInter = this.loadedInterventionsDico.getValue( interData.Id );
            
            // one ne merge pas directement dans l'objet en mémoire car dans le process des objets peuvent être mis à null, on merge via une copie
            Lodash.merge( updatedInter, interData );
            
            // état de l'intervention
            interState = this.interventionsStateDico.getValue( interData.Id );
            interState.Loaded = interState.Loaded || fullIntervention;
        }
        else
        {
            interState = this.interventionsStateDico.setValue( interData.Id, { Loaded: fullIntervention, Selected: false } );

            // création d'une nouvelle intervention, on merge dedans les data qu'on a reçues
            let newIntervention = new Intervention();
            Lodash.merge( newIntervention, interData);

            this.loadedInterventionsDico.setValue( interData.Id, newIntervention );
            updatedInter = newIntervention;
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
        this.http.get("data/demoData.json").toPromise()
        .then( response => {
            this.demoData = response.json();
        }) 
        .catch( reason => console.log(reason));
    }


    /**
     * Récupère la liste des types de maincourantes d'interventions
     */
    private loadTypeMaincour()
    {
        this.proxy.server.loadTypeMaincour()
            .done( (typesMainCour : ITypeMainCourante[]) => {

                console.log("Réception des types de mains courantes d'intervention.");
                
                // on garde la liste en mémoire dans le service, la vue pourra se bind directement dessus
                typesMainCour.map( tmc => { this.listeTypeMaincour[tmc.Type] = tmc.Libelle; } );
                
                // log les libellés:
                //this.listeTypeMaincour.forEach( i => { console.log(this.listeTypeMaincour.indexOf(i) + ':' + i); } );

             } )
            .fail( ( e : any ) => {
                console.error('Erreur lors de la récupération des types de mains courantes d\'interventions.');
                console.error( e );
            } );
    }

    /**
     * Récupère la liste des types de maincourantes d'interventions
     */
    private loadM1LibelleDivers()
    {
        this.proxy.server.loadM1LibelleDivers()
            .done( (m1LibelleDivers : ITypeMainCourante[]) => {

                console.log("Réception des libellés divers M1.");
                
                // on garde la liste en mémoire dans le service, la vue pourra se binder directement dessus
                m1LibelleDivers.map( lib => { this.listeM1LibelleDivers[lib.Type] = lib.Libelle; } );
                
                // log les libellés:
                // this.listeTypeMaincour.forEach( i => { console.log(this.listeTypeMaincour.indexOf(i) + ':' + i); } );

             } )
            .fail( ( e : any ) => {
                console.error('Erreur lors de la récupération des libellés divers du M1.');
                console.error( e );
            } );
    }

    /**
     * Ajout d'une nouvelle main courante
     * @param numFi : numéro de la fiche
     * @param typeMaincour : type de main courante
     * @param comment : commentaire
     */
    public addNewMaincourante( numFi: number, typeMaincour: number, comment: string ) : void
    {
        console.log("Envoi d'une main courante au serveur: ");
        console.log({"userId":this.userId, "numFi": numFi, "typeMaincour": typeMaincour, "comment":comment});
        
        this.proxy.server.addNewMaincourante( this.userId, numFi, typeMaincour, comment);
    }

    /**
     * Envoi d'un changement d'intervention
     * @param jsonInterChange : les changements
     */
    public sendInterChange( jsonInterChange : any ) : void
    {
        console.log(`Envoi d'un changement d'intervention: ${jsonInterChange}`);
        console.log(jsonInterChange);
        
        this.proxy.server.sendInterChange( jsonInterChange );
    }

    /**
     * Recheche des anciennes interventions avec la requête suivante
     * @param queryString string
     */
    searchInterventions( queryString : string )
    {
        this.clearSearchResults();

        if ( queryString )
        {
            console.log(`Recherche des anciennes interventions avec la requête suivante: '${queryString}'`);
            this.proxy.server.searchInterventions( queryString );
        }
    }

    /**
     * Efface les résultats de la recherche
     */
    clearSearchResults()
    {
        let searchResult : Intervention[] = this.loadedInterventionsDico.values().filter( i => i.Etat == Etat.Close || i.Etat == Etat.Annulee );
        for( let i of searchResult )
        {
            this.loadedInterventionsDico.remove( i.Id );
        }
    }

    submit( intervention : Intervention ) : void 
    {
        console.log(`Demande de transmission de la fiche ${intervention.Id}.`);
        this.proxy.server.submit( intervention.Id );
    }

    close( intervention : Intervention ) : void 
    {
        console.log(`Demande de clôture de la fiche ${intervention.Id}.`);
        this.proxy.server.close( intervention.Id );
    }

    cancel( intervention : Intervention ) : void 
    {
        console.log(`Demande d'annulation de la fiche ${intervention.Id}.`);
        this.proxy.server.cancel( intervention.Id );
    }



 }



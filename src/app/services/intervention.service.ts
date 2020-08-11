/**
 * Created by abreneli on 04/07/2016.
 */

import { Intervention } from '../model/intervention';
import { InterventionState } from '../model/intervention_state';
import { OrigineFiche, TypeFiche, MotifIntervention, Trajet, TypePresence, DepotBonIntervention, Etat } from '../model/enums';
import { ITypeMainCourante } from "../model/type_maincour";
import {Message} from "../model/message";
import { Injectable }    from '@angular/core';
import { Subject }    from 'rxjs';
import * as Lodash from 'lodash';
import { ConnectionStatus } from './connection.status';
import * as Collections from 'typescript-collections';
import { Observable } from 'rxjs-compat/Observable';
import { SearchQuery } from './searchQuery';

import 'signalr';

import { PushNotificationService } from './push-notification.service';

export enum InterventionDataType {
    Full,
    Partial,
    Change
}

@Injectable()
export class InterventionService  {


    private loadedInterventionsDico : Collections.Dictionary<string, Intervention> = new Collections.Dictionary<string, Intervention>();
    private interventionsStateDico : Collections.Dictionary<string, InterventionState> = new Collections.Dictionary<string, InterventionState>();
    private interventionsAppUrl = 'app/interventions';  // URL to web api

    // liste des changements
    private _newInterDataSource = new Subject< Intervention >();
    private _newMessagesSource = new Subject< [Intervention, Message] >();

    // observables stream:
    public newInterData$ = this._newInterDataSource.asObservable();
    public newMessages$ = this._newMessagesSource.asObservable();

    private _listeTypeMaincour : ITypeMainCourante[] = [];

    // on garde en mémoire la liste des types de maincourantes:
    public get listeTypeMaincour() : ITypeMainCourante[]
    {
        return this._listeTypeMaincour;
    };
    public set listeTypeMaincour( value: ITypeMainCourante[] )
    {
        this._listeTypeMaincour = value;
    };

    public listeM1LibelleDivers : ITypeMainCourante[] = [];

    /**
     * Constructeur, il charge le fichier de config qui contient l'adresse de connexion
     * au serveur.
     */
    constructor(private _connectionStatus: ConnectionStatus, private pushNotificationService: PushNotificationService )
    {
        // le chargement du script doit être effectué avant de pouvoir initialiser les callbacks de notre service InterventionService
        _connectionStatus.promiseHubScriptLoaded.then( () =>
        {
            // initialisation des callbacks propres au service d'interventions:
            this.initCallbacks();

            // connection du service d'interventions:
            _connectionStatus.start().then( () => {
                this.onServiceInterConnected();
            });
        } ).catch(( e : any ) => {
            this._connectionStatus.addErrorMessage( `Erreur lors de l'execution de la promesse promiseHubScriptLoaded : ${e}` );
        });        
     }


    // le service expose une intervention sélectionnée, les composants intéressés peuvent s'enregistrer auprès de cette intervention sélectionnée
    // c'est généralement une intervention recherchée en particulier est insérée:
    public selectedIntervention: Observable<Array<Intervention>> = new Observable<Array<Intervention>>();

    private connectionDetected : () => void;

    /**
     * Fonctions d'intervention appelées par le serveur
     */
    private initCallbacks() : void
    {

        let hubConnection = this._connectionStatus.HubConnection;

        hubConnection.on('newInterventionData',(interventionData : Intervention) =>{
            console.log('INFO GMA callback newInterventionData');
            this.onReceiveInterventionData( interventionData, InterventionDataType.Change );
        });

        hubConnection.on('newSearchResults',(searchResults : Intervention[]) =>{
            console.log('INFO GMA callback newSearchResults');
            console.log( "Receiving search results:" );
            this.onReceiveInterventionList( searchResults );
        });

        hubConnection.on('newChatMessage',(message : Message) =>{
            console.log('INFO GMA callback newChatMessage');
            this.onReceiveMessage( message );
        });
    }


    // fonction appelée au moment de la connection au serveur
    private onServiceInterConnected() : void
    {
        console.log(`INFO GMA ${this._connectionStatus.HubConnection.state}`);

        // chargement automatique des interventions en cours à la connection:
        this.loadCurrentInterventionList();

        // Abonnenement aux notifications
        this.subscribeNotifications();
    }

    /** Cette fonction permet à l'utilisateur de souscrire aux notifications push
     * Remarque: cette méthode est automatiquement appelée à la connection.
     */
    private subscribeNotifications() : void
    {
        console.log(`INFO GMA subscribeNotifications`);

      if ( this.pushNotificationService )
        this.pushNotificationService.subscribeUser();

    }

    /** Cette fonction charge les interventions qui sont en cours
     * Toutes les données des interventions ne sont pas chargés: seulement les données essentielles.
     * Remarque: cette méthode est automatiquement appelée à la connection.
     */
    private loadCurrentInterventionList() : void
    {
        console.log(`INFO GMA  loadCurrentInterventionList`);

        this._connectionStatus.HubConnection.invoke('QueryCurrentFI')
        .then((newInterventions : Intervention[]) => 
        
            {
                console.log(`INFO GMA  gestion des interventions récupéré`);
                this.onReceiveInterventionList( newInterventions );
            })
            .catch(( e : any ) => {
                    console.error(`INFO GMA error ${e}`);
                    this._connectionStatus.addErrorMessage( `Erreur lors de la récupération des interventions courantes: ${e}` );
                } );
    }

    /**
     * Arrivée d'un lot d'interventions depuis le serveur
     */
    private onReceiveInterventionList( newInterventions : Intervention[] )
    {
        console.log( newInterventions.length + " interventions reçues.");

        let updatedCount : number = 0;
        let createdCount : number = 0;

        // ajout des interventions au dico:
        for( let inter of newInterventions )
        {
            this.onReceiveInterventionData( inter, InterventionDataType.Full );
        }
    }

    /**
     * Arrivée d'un message de chat sur un numéro de fiche
     */
    private onReceiveMessage( message : Message )
    {
        console.log( `Receiving new message for intervention ${message.IdChannel}: ${message.Texte}` );

        let messageInter = this.loadedInterventionsDico.getValue( message.IdChannel ) ;
        if ( messageInter != null )
        {
            messageInter.Chat.push( message );

            messageInter.NotificationChange = true;

            this._newMessagesSource.next( [ messageInter, message] );
        }
    }

    /**
     * Fonction de récupération des interventions courantes
     */
    public getLoadedInterventions(): Intervention[]
     {
        if ( this._connectionStatus.connected )
        {
            let interventions = this.loadedInterventionsDico.values();
            return interventions;
        }
        else
            return [];
    }


    /**
     * Permet de récupérer tout le détail d'une intervention
     */
    private getFullIntervention( numFI : string, siteId : string = null ) : Promise<Intervention>
    {
        if ( this._connectionStatus.connected )
        {
            let interState = this.getInterventionState( numFI );
            if ( interState && interState.Loaded )
            {
                // intervention déjà chargée, on retourne la même intervention
                return new Promise<Intervention>((resolve) =>
                {
                    let inter = this.loadedInterventionsDico.getValue(numFI);
                    if (!inter)
                        throw new Error(`L'intervention ${numFI} n'est pas le dico!`);

                    resolve(inter);
                    return;
                } );
            }
            else
            {
                // récupération de l'intervention auprès des services de sa majesté IMAInter
                return this.getInterventionFromServer( numFI, siteId );
            }
        }
    }


    /**
     * Charge une intervention
     * numFI : numéro de fiche
     */
    public connectAndLoadIntervention( numFI : string ) : Promise<Intervention>
    {
        let parentPromise = new Promise<Intervention>((resolve) =>
        {
            this._connectionStatus.waitForReconnection().then(() =>
            {
                resolve(this.getFullIntervention(numFI, null));
                return;
            });
        });

        return parentPromise;
    }

    /**
     * @param numFI getInterventionFromServer
     */
    private getInterventionFromServer( numFI : string, siteId : string ) : Promise<Intervention>
    {
        let getInterPromise = new Promise<Intervention>( (resolve, reject ) =>
        {
             console.info( "Chargement de l'intervention ", numFI);
             
             this._connectionStatus.HubConnection.invoke('GetIntervention',numFI, siteId)
                .then((interventionWithDetails : Intervention) =>
                {
                    let interventionMerged = this.onReceiveInterventionData( interventionWithDetails, InterventionDataType.Full );
                    resolve(interventionMerged);
                })
                .catch( ( e : any ) => 
                {
                    this._connectionStatus.addErrorMessage( `Erreur lors de la récupération de l'intervention ${numFI}. ${e}` );
                    reject(e);
                })
        });
        return getInterPromise;
    }

    /**
     * Appelé lorsqu'une nouvelle intervention a été reçu par le service.
     *
     * Le comportement dépend suivant InterventionDataType
     * Full: l'intervention est complète, elle peut contenir des valeurs null écrasante, et on retient le fait qu'on ait chargé l'inter complète.
     * Partail: l'intervention est complète, les valeurs null sont supprimées
     * Change: il s'agit d'un changement sur une intervention dont les valeurs null sont écransantes
     */
    private onReceiveInterventionData( interData: Intervention, dataType : InterventionDataType) : Intervention
    {
        // on logue les données reçues: l'intervention
        console.log( "Receiving data (" + InterventionDataType[dataType] + "):", interData );

        let updatedInter : Intervention = null;
        let interState : InterventionState;

        // cas de données d'intervention déjà chargée en mémoire
        if ( this.loadedInterventionsDico.containsKey( interData.Id ) )
        {
            // on met à jour l'intervention que nous avons actuellement en mémoire (elle n'est pas remplacée)
            updatedInter = this.loadedInterventionsDico.getValue( interData.Id );

            // on protège le champs que l'utilisateur est en train de modifier
            // if ( this.protectedDataFromWrites && interData.Id == this.protectedDataFromWrites.Id )
            // {
            //   var excudeObj = this.protectedDataFromWrites;
            //   for( var p in excudeObj )
            //   {

            //   }
            // }

            // one ne merge pas directement dans l'objet en mémoire car dans le process des objets peuvent être mis à null, on merge via une copie
            Lodash.merge( updatedInter, interData );

            updatedInter.NotificationChange = true;

            // état de l'intervention
            interState = this.interventionsStateDico.getValue( interData.Id );
            interState.Loaded = interState.Loaded || dataType == InterventionDataType.Full;
        }
        else
        {
            interState = this.interventionsStateDico.setValue( interData.Id, { Loaded: dataType == InterventionDataType.Full, Selected: false } );

            // création d'une nouvelle intervention, on merge dedans les data qu'on a reçues
            let newIntervention = new Intervention();

            // les réceptions d'interventions partielles ont des valeurs null, on les supprime
            if ( dataType == InterventionDataType.Partial )
                interData = this.omitByRecursively ( interData );

            Lodash.merge( newIntervention, interData);

            this.loadedInterventionsDico.setValue( interData.Id, newIntervention );
            updatedInter = newIntervention;
        }

        // on notifie les intéressés que de nouvelles data sont reçues sur une intervention:
        this._newInterDataSource.next( interData );

        return updatedInter;
    }

    /**
     * Supprime les valeurs null sur tous les membres:
     * https://stackoverflow.com/questions/44320693/lodash-mergewith-skip-with-some-key
     * https://stackoverflow.com/questions/37246775/how-to-delete-recursively-undefined-properties-from-an-object-while-keeping-th
     * @param value
     */
    private omitByRecursively(value : any) : any
    {
       return Lodash.isObject(value)?
        Lodash(value)
           .omitBy(Lodash.isNull)
           .mapValues(v => this.omitByRecursively(v))
           .value():
         value;
     }

    /**
     * Permet de récupérer l'état d'une intervention chargée. Il s'agit d'une donnée interne au client.
     */
    public getInterventionState( id: string )   : InterventionState
    {
        return this.interventionsStateDico.getValue( id );
    }

    /**
     * Ajout d'une nouvelle main courante
     * @param numFi : numéro de la fiche
     * @param typeMaincour : type de main courante
     * @param comment : commentaire
     */
    public addNewMaincourante( numFi: string, typeMaincour: string, comment: string ) : void
    {
        console.log("Envoi d'une main courante: ",
          {"login":this._connectionStatus.login, "numFi": numFi, "typeMaincour": typeMaincour, "comment":comment});
        
        this._connectionStatus.HubConnection.send('AddNewMaincourante', numFi, typeMaincour, comment);
    }

    // private protectedDataFromWrites : Any;

    /**
     * Envoi d'un changement d'intervention
     * @param jsonInterChange : les changements
     */
    public sendInterChange( jsonInterChange : any ) : void
    {
        console.log("Envoi d'un changement d'intervention:", jsonInterChange);

        this._connectionStatus.HubConnection.send('SendInterChange',jsonInterChange);
    }

    /**
     * Recheche des anciennes interventions avec la requête suivante
     * @param queryString string
     */
    public searchInterventions( query : SearchQuery ) : Promise<any>
    {
      console.info('Recherche des anciennes interventions avec la requête suivante: ', query);

      this.clearSearchResults();

      //TODO GMA Traitement reprendre ici !!
      //var connectAndSearchPromise = new Promise(() => this._connectionStatus.HubConnection.invoke('SearchInterventions', query ));
      
      // on s'assure qu'on est connecté, car la recherche peut se faire au démarrage sur la query
      let connectAndSearchPromise = this._connectionStatus.waitForReconnection().then( () =>
      {
        return this._connectionStatus.HubConnection.invoke('SearchInterventions', query );
      });

      return connectAndSearchPromise;
    }

    /**
     * Efface les résultats de la recherche
     */
    private clearSearchResults()
    {
        let searchResult : Intervention[] = this.loadedInterventionsDico.values().filter( i => i.Etat == Etat.Close || i.Etat == Etat.Annulee );
        for( let i of searchResult )
        {
            this.loadedInterventionsDico.remove( i.Id );
        }
    }

    public transfer( intervention : Intervention ) : void
    {
        console.log(`Demande de transmission par mail de la fiche ${intervention.Id}.`);

        this._connectionStatus.HubConnection.send('Transfer',intervention.Id);
    }

    public close( intervention : Intervention ) : void
    {
        console.log(`Demande de clôture de la fiche ${intervention.Id}.`);        

        this._connectionStatus.HubConnection.send('Close',intervention.Id);
    }

    public cancel( intervention : Intervention ) : void
    {
        console.log(`Demande d'annulation de la fiche ${intervention.Id}.`);

        this._connectionStatus.HubConnection.send('Cancel',intervention.Id);
    }

    public inProgress( intervention : Intervention ) : void
    {
        console.log(`Demande de passage de la fiche en cours ${intervention.Id}.`);

        this._connectionStatus.HubConnection.send('InProgress',intervention.Id);
    }

    public chat( numFi : string, message : string ) : void
    {
        console.log(`Envoi messages sur FI ${numFi}, texte: ${message}`);
        
        this._connectionStatus.HubConnection.send('Chat',numFi, message);
    }

    // Ces fonctions ne sont plus disponible tant qu'il n'y pas d'application mobile


    // public authorizeDeparture( interId : number ) : void
    // {
    //     console.log( "Authorisation de départ pour l'intervention " + interId );

    //     this._connectionStatus.proxyServer.authorizeDeparture( interId );
    // }

    // public immobilizeIntervenant( interId : number ) : void
    // {
    //     console.log( "Mise en statique de l'invervenant pour la fiche " + interId );

    //     this._connectionStatus.proxyServer.immobilizeIntervenant( interId );
    // }



    // public waitingDeparture( intervention : Intervention ) : boolean
    // {
    //     if ( intervention )
    //         return intervention.Etat == Etat.DemandeDepart;

    //     return false;
    // }

    // /**
    //  * Demande de mise à jour de la liste des sociétés AEPIA
    //  */
    // public updateSIList() : void
    // {
    //     console.log(`Demande de mise à jour de la liste des sociétés AEPIA`);

    //     this._connectionStatus.proxyServer.updateSIList();
    // }


    public addNewIntervention(): Intervention
    {
        let newIntervention = new Intervention();
        newIntervention.Operateur = "abreneli";
        newIntervention.IdM1 = 1;
        newIntervention.Id = "00000000-0000-0000-0000-000000000000";
        newIntervention.Creation = (new Date()).toISOString();

        this.loadedInterventionsDico.setValue( "00000000-0000-0000-0000-000000000000", newIntervention );

        this._newInterDataSource.next( newIntervention );

        return newIntervention;
    }

    /**
     * @param emails Valide la syntaxe d'une liste d'emails
     */
    public validateEmails( emails : string[] ) : boolean
    {
      if (!Array.isArray(emails))
        return false;

      let notEmptyEmails = emails.filter( email => email);

      return ( notEmptyEmails.length > 0 ) && notEmptyEmails.every( email => ! email || this.validateEmail(email) );
    }

    private validateEmail(email) : boolean
    {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
 }



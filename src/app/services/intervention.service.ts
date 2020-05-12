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


    private loadedInterventionsDico : Collections.Dictionary<number, Intervention> = new Collections.Dictionary<number, Intervention>();
    private interventionsStateDico : Collections.Dictionary<number, InterventionState> = new Collections.Dictionary<number, InterventionState>();
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
        } );
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
        let proxyClient = this._connectionStatus.proxyClient;

        // Méthode appelée quand une intervention en cours a été mise à jour ou ajoutée
        proxyClient.newInterventionData = ( interventionData : Intervention ) =>
        {
            this.onReceiveInterventionData( interventionData, InterventionDataType.Change );
        }

        proxyClient.newSearchResults = ( searchResults : Intervention[] ) =>
        {
            console.log( "Receiving search results:" );

            this.onReceiveInterventionList( searchResults );
        }

        proxyClient.newChatMessage = ( message : Message ) =>
        {
            this.onReceiveMessage( message );
        }
    }


    // fonction appelée au moment de la connection au serveur
    private onServiceInterConnected() : void
    {
        // chargement automatique des interventions en cours à la connection:
        this.loadCurrentInterventionList();

        // chargement de la liste des types de maincourantes:
        this.loadTypeMaincour();

        // chargement de la liste des libelles divers du M1, car ils sont utilisés par certaiens maincourante generies:
        this.loadM1LibelleDivers();

        this.subscribeNotifications();
    }

    /** Cette fonction permet à l'utilisateur de souscrire aux notifications push
     * Remarque: cette méthode est automatiquement appelée à la connection.
     */
    private subscribeNotifications() : void
    {
      if ( this.pushNotificationService )
        this.pushNotificationService.subscribeUser();

    }

    /** Cette fonction charge les interventions qui sont en cours
     * Toutes les données des interventions ne sont pas chargés: seulement les données essentielles.
     * Remarque: cette méthode est automatiquement appelée à la connection.
     */
    private loadCurrentInterventionList() : void
    {
        this._connectionStatus.proxyServer.queryCurrentFI()
            .done( (newInterventions : Intervention[]) => this.onReceiveInterventionList( newInterventions ) )
            .fail( ( e : any ) => {
            this._connectionStatus.addErrorMessage( `Erreur lors de la récupération des interventions courrantes: ${e}` );
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
            this.onReceiveInterventionData( inter, InterventionDataType.Partial );
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
    private getFullIntervention( numFI : number, siteId : number = null ) : Promise<Intervention>
    {
        if ( this._connectionStatus.connected )
        {
            let interState = this.getInterventionState( numFI );
            if ( interState && interState.Loaded )
            {
                // intervention déjà chargée, on retourne la même intervention
                return new Promise<Intervention>( ( resolve ) => {

                  let inter =  this.loadedInterventionsDico.getValue( numFI );
                  if ( ! inter )
                    throw new Error(`L'intervention ${numFI} n'est pas le dico!`);

                  return inter;
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
    public connectAndLoadIntervention( numFI : number ) : Promise<Intervention>
    {
        let loadInterventionPromise = this._connectionStatus.waitForReconnection().then( () =>
        {
            return this.getFullIntervention( numFI, null );
        });

        return loadInterventionPromise;
    }

    /**
     * @param numFI getInterventionFromServer
     */
    private getInterventionFromServer( numFI : number, siteId : number ) : Promise<Intervention>
    {
        let getInterPromise = new Promise<Intervention>( (resolve, reject ) =>
        {
            console.info( "Chargement de l'intervention ", numFI);

            this._connectionStatus.proxyServer.getIntervention( numFI, siteId )
                .done( (interventionWithDetails : Intervention) =>
                {
                    let interventionMerged = this.onReceiveInterventionData( interventionWithDetails, InterventionDataType.Full );
                    resolve(interventionMerged);
                } )
                .fail( ( e : any ) => {
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
    public getInterventionState( id: number )   : InterventionState
    {
        return this.interventionsStateDico.getValue( id );
    }


    /**
     * Récupère la liste des types de maincourantes d'interventions
     */
    private loadTypeMaincour()
    {
        this._connectionStatus.proxyServer.loadTypeMaincour()
            .done( (typesMainCour : ITypeMainCourante[]) => {

                console.log(`Réception des types de mains courantes d'intervention: ${typesMainCour.length} libellés reçus.`);

                let listeTypeMaincour : string[] = [];

                // on remplace la liste existante éventuelle des types de maincourantes
                this.listeTypeMaincour = typesMainCour;

                console.log( this.listeTypeMaincour.length + " types de maincourantes récupérés." );
             } )
            .fail( ( e : any ) => {
                this._connectionStatus.addErrorMessage( `Erreur lors de la récupération des types de maincourantes d\'interventions. ${e}` );
            } );
    }

    /**
     * Récupère la liste des types de maincourantes d'interventions
     */
    private loadM1LibelleDivers()
    {
        this._connectionStatus.proxyServer.loadM1LibelleDivers()
            .done( (m1LibelleDivers : ITypeMainCourante[]) => {

                console.log(`Réception des libellés divers M1: ${m1LibelleDivers.length} libellés reçus.`);

                this.listeM1LibelleDivers = m1LibelleDivers;
             } )
            .fail( ( e : any ) => {
                this._connectionStatus.addErrorMessage( `Erreur lors de la récupération des libellés divers du M1. ${e}` );
            } );
    }

    /**
     * Ajout d'une nouvelle main courante
     * @param numFi : numéro de la fiche
     * @param typeMaincour : type de main courante
     * @param comment : commentaire
     */
    public addNewMaincourante( numFi: number, typeMaincour: ITypeMainCourante, comment: string ) : void
    {
        console.log("Envoi d'une main courante: ",
          {"login":this._connectionStatus.login, "numFi": numFi, "typeMaincour": typeMaincour, "comment":comment});

        this._connectionStatus.proxyServer.addNewMaincourante( numFi, typeMaincour.Libelle, comment);
    }

    // private protectedDataFromWrites : Any;

    /**
     * Envoi d'un changement d'intervention
     * @param jsonInterChange : les changements
     */
    public sendInterChange( jsonInterChange : any ) : void
    {
        console.log("Envoi d'un changement d'intervention:", jsonInterChange);

        this._connectionStatus.proxyServer.sendInterChange( jsonInterChange );
    }

    /**
     * Recheche des anciennes interventions avec la requête suivante
     * @param queryString string
     */
    public searchInterventions( query : SearchQuery ) : Promise<any>
    {
      console.info('Recherche des anciennes interventions avec la requête suivante: ', query);

      this.clearSearchResults();

      // on s'assure qu'on est connecté, car la recherche peut se faire au démarrage sur la query
      let connectAndSearchPromise = this._connectionStatus.waitForReconnection().then( () =>
      {
        return this._connectionStatus.proxyServer.searchInterventions( query );
      } );

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
        this._connectionStatus.proxyServer.transfer( intervention.Id );
    }

    public close( intervention : Intervention ) : void
    {
        console.log(`Demande de clôture de la fiche ${intervention.Id}.`);
        this._connectionStatus.proxyServer.close( intervention.Id );
    }

    public cancel( intervention : Intervention ) : void
    {
        console.log(`Demande d'annulation de la fiche ${intervention.Id}.`);

        this._connectionStatus.proxyServer.cancel( intervention.Id );
    }

    public inProgress( intervention : Intervention ) : void
    {
        console.log(`Demande de passage de la fiche en cours ${intervention.Id}.`);
        this._connectionStatus.proxyServer.inProgress( intervention.Id );
    }

    public chat( numFi : number, message : string ) : void
    {
        console.log(`Envoi messages sur FI ${numFi}, texte: ${message}`);
        this._connectionStatus.proxyServer.chat( numFi, message );
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
        newIntervention.Id = 1;
        newIntervention.Creation = (new Date()).toISOString();

        this.loadedInterventionsDico.setValue( 1, newIntervention );

        this._newInterDataSource.next( newIntervention );

        return newIntervention;
    }
 }



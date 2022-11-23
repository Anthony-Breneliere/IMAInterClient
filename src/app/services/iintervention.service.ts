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
 export abstract class IInterventionService  {


     // observables stream:
     public abstract newInterData$ : Observable<Intervention>;
     public abstract newMessages$ : Observable<[Intervention, Message]>;

     // on garde en mémoire la liste des types de maincourantes:
     public abstract get listeTypeMaincour() : ITypeMainCourante[];

     public abstract set listeTypeMaincour( value: ITypeMainCourante[] );

     public abstract listeM1LibelleDivers : ITypeMainCourante[];

     // le service expose une intervention sélectionnée, les composants intéressés peuvent s'enregistrer auprès de cette intervention sélectionnée
     // c'est généralement une intervention recherchée en particulier est insérée:
     public abstract selectedIntervention: Observable<Array<Intervention>>;

     /**
      * Fonction de récupération des interventions courantes
      */
     public abstract getLoadedInterventions(): Intervention[];

     /**
      * Charge une intervention
      * numFI : numéro de fiche
      */
     public abstract connectAndLoadIntervention( numFI : string ) : Promise<Intervention>;

     /**
      * Permet de récupérer l'état d'une intervention chargée. Il s'agit d'une donnée interne au client.
      */
     public abstract getInterventionState( id: string ) : InterventionState;

     /**
      * Ajout d'une nouvelle main courante
      * @param numFi : numéro de la fiche
      * @param typeMaincour : type de main courante
      * @param comment : commentaire
      */
     public abstract addNewMaincourante( numFi: string, typeMaincour: string, comment: string ) : void;


     /**
      * Envoi d'un changement d'intervention
      * @param jsonInterChange : les changements
      */
     public abstract sendInterChange( jsonInterChange : any ) : Promise<void>;

     /**
      * Recheche des anciennes interventions avec la requête suivante
      * @param queryString string
      */
     public abstract searchInterventions( query : SearchQuery ) : Promise<any>;

     /**
      * Charge plus de résulats correspondant à la dernière recherche
      * @param queryString string
      */
     public abstract loadMoreResults() : Promise<any>;

     public abstract transfer( intervention : Intervention ) : void;

     public abstract close( intervention : Intervention ) : void;

     public abstract cancel( intervention : Intervention ) : void;

     public abstract inProgress( intervention : Intervention ) : void;

     public abstract chat( numFi : string, message : string ) : void;

     public abstract addNewIntervention(): Intervention;

     /**
      * @param emails Valide la syntaxe d'une liste d'emails
      */
     public abstract validateEmails( emails : string[] ) : boolean;
  }



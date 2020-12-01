import { Injectable } from '@angular/core';
import { ConnectionStatus } from './connection.status';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  public pushNotificationStatus = {
    isSubscribed: false,
    isSupported: false,
    isInProgress: false
  };
  public notifications = [];

  private swRegistration: ServiceWorkerRegistration = null;

  constructor(private _connectionStatus: ConnectionStatus) {
  }

  /** Cette fonction vérifie la compatibilité du navigateur de l'utilisateur aux service worker et  notifications push
    * Si Le navigateur est compatible, il inscrit le serviceWorker
     */
  init()
  {
    console.log("Initialisation du service worker");
    if ('serviceWorker' in navigator )
    {
      if ( 'PushManager' in window )
      {
        console.log("navigateur compatible service worker et push");

        navigator.serviceWorker.register('assets/sw.js').then( swReg => {

            console.log('Service Worker is registered', swReg);

            this.swRegistration = swReg;
          })
          .catch(error => {
            console.error('Service Worker register error', error);
          });

        this.pushNotificationStatus.isSupported = true;
      }
      else
      {
        console.warn("navigateur pas compatible service worker et push");
        this.pushNotificationStatus.isSupported = false;
      }
    }
  }

  /**
   * Cette fonction permet de comparer l'égalité de 2 Uint8Array
   */
   private uint8ArrayEqual (buf1:Uint8Array, buf2: Uint8Array)
  {
      if (buf1.byteLength != buf2.byteLength) return false;
      var dv1 = new Int8Array(buf1);
      var dv2 = new Int8Array(buf2);
      for (var i = 0 ; i != buf1.byteLength ; i++)
      {
          if (dv1[i] != dv2[i]) return false;
      }
      return true;
  }  
  /**
   * Cette fonction créé une souscription, si l'utilisateur n'a pas deja une souscription, dans le pushManager du service worker
   * et envoie les infos de la souscription au serveur ImaInter
   */
  subscribeUser()
  {
    if ( ! this.swRegistration )
    {
      console.warn("Pas de service de souscription de notification dans le navigateur.");
      return;
    }

    const applicationServerKey = this.urlB64ToUint8Array(environment.applicationServerPublicKey);   
    // On récupère la souscription existante dans le pushManager
    this.swRegistration.pushManager.getSubscription().then( subscription =>
    {
      if(subscription != null)
      {
        // si la souscription est valide, on a rien a faire
        if(this.uint8ArrayEqual(new Uint8Array(subscription.options.applicationServerKey),applicationServerKey))
        {
            console.info("souscription récupérée valide: ", subscription);
        }
        // Sinon on la supprime et on en génère une nouvelle
        else
        {
          console.info("la souscription récupérée ne correspond pas à celle du serveur");
          subscription.unsubscribe();
          this.generateSubscription(applicationServerKey);
        }
      }
      // Si aucune souscription n'existe, on en créé une
      else
      {
        console.info("aucune souscription existante");
        this.generateSubscription(applicationServerKey);
      }
    });
  }
  
  private generateSubscription(applicationServerKey: Uint8Array) {
    // Si l'utilisateur n'a pas de souscription, on lui créé une souscription
    this.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(sub => {
      console.info('nouvelle souscription générée');
      this.SendSubscriptionToService(sub);
      console.info("souscription: ", sub);
    })
    .catch(err => {
      console.error('Erreur à la création de la souscription: ', err);
      return null;
    });
  }

  private SendSubscriptionToService(subscription)
  {
    (async() => {
      console.log("Attente de l'arrivée du username");

      while(this._connectionStatus.login == null)
          await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log("Username défini to: " + this._connectionStatus.login);
      
      // On envoie les informations de la souscription utilisateur à ImaInterService
      this.addOrUpdateUserSubscription(this._connectionStatus.login, subscription);
      this.pushNotificationStatus.isSubscribed = true;
      console.log('Souscription récupérée ou créée');
    })();
  }

  /** Cette fonction appelle le hub pour ajouter ou mettre à jour une souscription utilisateur
     */
  private addOrUpdateUserSubscription(username: string, subscription: PushSubscription) {
    var newSub = subscription.toJSON();

    this._connectionStatus.HubConnection.send('AddOrUpdateUserSubscription',username, {
        auth: newSub.keys.auth,
        p256DH: newSub.keys.p256dh,
        endPoint: newSub.endpoint
      });
  }

  /** Cette fonction encode un string en base 64 en tableau d'Uint8
     */
  private urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

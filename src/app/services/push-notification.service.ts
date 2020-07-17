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
      if (subscription == null)
      {
        // Si l'utilisateur n'a pas de souscription, on lui créé une souscription
        this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
        .then(subscription => {
          console.log(`utilisateur "${this._connectionStatus.login}"`)

          // On envoie les informations de la souscription utilisateur à ImaInterService
          this.addOrUpdateUserSubscription(this._connectionStatus.login, subscription);
          this.pushNotificationStatus.isSubscribed = true;
          console.log('une nouvelle souscription a été créé');
        })
        .catch(err => {
          console.error('Erreur à la création de la souscription: ', err);
          // console.log('DOMEXCEPTION MESSAGE: ', err.message);
          // console.log('DOMEXCEPTION NAME: ', err.name);
          // console.log('DOMEXCEPTION CODE: ', err.code);
          return null;
        });
      }
      // Si la souscription utilisateur existe deja,
      // On envoie toute de meme les informations au cas ou celle ci n'aurait pas été envoyé au serveur
      else {
        this.addOrUpdateUserSubscription(this._connectionStatus.login, subscription);
        console.log('la souscription existante a été récupéré');
      }

      console.info("Subscription: ", subscription);
    });
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

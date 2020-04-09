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

  private swRegistration:ServiceWorkerRegistration = null;

  constructor(private _connectionStatus: ConnectionStatus) { 
    console.log("Constructor NotificationService");
  }

  /** Cette fonction vérifie la compatibilité du navigateur de l'utilisateur aux service worker et  notifications push
    * Si Le navigateur est compatible, il inscrit le serviceWorker
     */
    init() {
      console.log("Initialisation du service worker");
     if ('serviceWorker' in navigator && 'PushManager' in window) {
 
       console.log("navigateur compatible service worker et push");
       navigator.serviceWorker.register('assets/sw.js')
         .then(swReg => {
           console.log('Service Worker is registered', swReg);
 
           this.swRegistration = swReg;
           //this.checkSubscription();
         })
         .catch(error => {
           console.error('Service Worker Error', error);
         });
       this.pushNotificationStatus.isSupported = true;
     } else {
       console.log("navigateur pas compatible service worker et push");
       this.pushNotificationStatus.isSupported = false;
     }
 
     navigator.serviceWorker.addEventListener('message', (event) => {
       this.notifications.push(event.data);
     });
 
   }

  //  /** Cette fonction vérifie que le pushManager du serviceworker dispose d'une souscription
  //    */
  // checkSubscription() {
  //   this.swRegistration.pushManager.getSubscription()
  //     .then(subscription => {
  //       //console.log(subscription);
  //       console.log("Subscription : " + JSON.stringify(subscription));        
  //       this.pushNotificationStatus.isSubscribed = !(subscription === null);
  //     });
  // }

  /** Cette fonction créé une souscription dans le pushManager du service worker
   * et envoie les infos au serveur ImaInter
   */
  subscribeUserIfNot() {    
    const applicationServerKey = this.urlB64ToUint8Array(environment.applicationServerPublicKey);

    this.swRegistration.pushManager.getSubscription()
    .then(
      subscription => {
        if(subscription == null)
        {
          this.swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          })
          .then(subscription => {
              console.log(JSON.stringify(subscription.toJSON()));
              var newSub = subscription.toJSON();
      
              console.log(`user "${this._connectionStatus.login}"`)
      
              this._connectionStatus.proxyServer.subscribeNotifications(this._connectionStatus.login,{
                auth: newSub.keys.auth,
                p256DH: newSub.keys.p256dh,
                endPoint: newSub.endpoint        
              });
              this.pushNotificationStatus.isSubscribed = true;        
            })
            .catch(err => {
              console.log('Failed to subscribe the user: ', err);
              // console.log('DOMEXCEPTION MESSAGE: ', err.message);
              // console.log('DOMEXCEPTION NAME: ', err.name);
              // console.log('DOMEXCEPTION CODE: ', err.code);
              return null;
            });
        }
        else
        {
          var newSub = subscription.toJSON();
          this._connectionStatus.proxyServer.subscribeNotifications(this._connectionStatus.login,{
            auth: newSub.keys.auth,
            p256DH: newSub.keys.p256dh,
            endPoint: newSub.endpoint        
          });

          console.log("souscription existante : " + JSON.stringify(subscription.toJSON()));
        }
      }
    )
  }


  /** Cette fonction encode un string en base 64 en tableau d'Uint8
     */
    urlB64ToUint8Array(base64String) {
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
'use strict'; 

var url = 'http://localhost:4200/IMAInter/#/intervention/';

// Function permettant de savoir si un client est sur l'imaInter ou pas
// TODO GMA fonction a supprimer ?
function isClientFocused() { 
    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            let clientIsFocused = false;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.focused) {
                    clientIsFocused = true;
                    break;
                }
            }

            return clientIsFocused;
        });
}

// gestion de l'affichage des notifications push
self.addEventListener('push', function (event) {
    var data = event.data.json();
    console.log(`[Service Worker] Push Received: "${data}"`);
    
    const title = data.Title;
    const options = {
        body: data.Message,
        icon: 'imainter.ico',
        badge: 'imainter.bmp',
        data: url + data.InterventionId
    };

    // Client isn't focused, we need to show a notification.
    return self.registration.showNotification(title, options);    
}); 

// Gestion du click sur la notification
self.addEventListener('notificationclick', function (event) {

    const urlToOpen = new URL(event.notification.data, self.location.origin).href;

    console.log('[Service Worker] Notification click Received.');
    console.log(event);

    event.notification.close();

    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(urlToOpen);
            }
        });

    event.waitUntil(promiseChain);
});
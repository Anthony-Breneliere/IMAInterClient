"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by abreneli on 04/07/2016.
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Intervention_1 = require("../model/Intervention");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/toPromise");
var enums_1 = require("../model/enums");
var Collections = require("typescript-collections");
var Subject_1 = require("rxjs/Subject");
var Lodash = require("lodash");
require("signalr");
var InterventionService = (function () {
    /**
     * Constructeur, il charge le fichier de config qui contient l'adresse de connexion
     * au serveur.
     */
    function InterventionService(http) {
        var _this = this;
        this.http = http;
        this.loadedInterventionsDico = new Collections.Dictionary();
        this.interventionsStateDico = new Collections.Dictionary();
        this.interventionsAppUrl = 'app/interventions'; // URL to web api
        this._m1Connected = false;
        this._plottiConnected = false;
        // liste des changements
        this.newInterDataSource = new Subject_1.Subject();
        this.newMessagesSource = new Subject_1.Subject();
        // observables stream:
        this.newInterData$ = this.newInterDataSource.asObservable();
        this.newMessages$ = this.newMessagesSource.asObservable();
        // todo: attente d'une fonction d'ESI permettant de récupére le used Id à partir de l'opérateur
        this.userId = 9886433;
        // on garde en mémoire la liste des types de mains courantes:
        this.listeTypeMaincour = [];
        this.listeM1LibelleDivers = [];
        // le service expose une intervention sélectionnée, les composants intéressés peuvent s'enregistrer auprès de cette intervention sélectionnée
        // c'est généralement une intervention recherchée en particulier est insérée:
        this.selectedIntervention = new Observable_1.Observable();
        // C'est le proxy sur le hub SignalR, il permet d'appeler des méthodes coté server et au serveur
        // d'appeler des méthodes sur tous les clients.
        this.proxy = null;
        this.isScriptLoaded = false;
        this.http.get("data/imainter.json").toPromise().then(function (response) {
            _this.onConfigFileLoaded(response);
        });
    }
    Object.defineProperty(InterventionService.prototype, "Connected", {
        // accesseurs publics:
        get: function () { return jQuery && jQuery.connection && jQuery.connection.hub.state == 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionService.prototype, "Logged", {
        get: function () { return this.login != null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionService.prototype, "m1Connected", {
        get: function () { return this._m1Connected; },
        set: function (value) { this._m1Connected = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionService.prototype, "plottiConnected", {
        get: function () { return this._plottiConnected; },
        set: function (value) { this._plottiConnected = value; },
        enumerable: true,
        configurable: true
    });
    /**
     * Lecture du fichier de config, éventuellement des données de démo et assignation des callbacks
     * des méthode du hub.
     */
    InterventionService.prototype.onConfigFileLoaded = function (response) {
        this.config = response.json();
        console.log(this.config);
        if (this.useDemoData)
            this.getDemoData();
        this.loadHubsScript();
    };
    /**
     * Cette méthode exécute le script de génération des hubs proxys signalR. Ce script
     * est est généré le serveur SignalR, il faut donc l'appeler dynamiquement.
     */
    InterventionService.prototype.loadHubsScript = function () {
        var _this = this;
        var hubScriptUrl = this.config['imainter']['server'] + "/imaintersignalr/hubs";
        jQuery.getScript(hubScriptUrl, function () {
            _this.isScriptLoaded = true;
            if (_this.scriptLoaded != null)
                _this.scriptLoaded();
            _this.initHubCallbacks();
        });
    };
    /**
     * Retourn vrai si on est connecté au server
     */
    InterventionService.prototype.isServerConnected = function () {
        var isConnected = !jQuery.connection.hub.disconnected;
        return isConnected;
    };
    /**
     * affectation des callbacks aux fonctions du hubproxy. Ce sont les callbacks qui sont
     * appelées lorsque le serveur broadcast des informations.
     */
    InterventionService.prototype.initHubCallbacks = function () {
        var _this = this;
        var signalRUrl = this.config['imainter']['server'] + "/imaintersignalr";
        var connection = jQuery.connection;
        var hub = connection.hub;
        hub.url = signalRUrl;
        hub.logging = true;
        hub.error(function (error) { console.error('SignalR error: ' + error); });
        hub.connectionSlow(function () {
            console.log('We are currently experiencing difficulties with the connection.');
        });
        hub.stateChanged(function (change) {
            console.log("L'état de la connexion a changé de l'état " + change.oldState + " à l'état " + change.newState + " (Connecting = 0, Connected, Reconnecting, Disconnected)");
            // s'il existe une promesse de reconnection, alors cette promesse est tenue:
            if (change.newState == 1 && _this.reconnectionResolve)
                _this.reconnectionResolve();
        });
        this.proxy = connection['iMAInterHub'];
        // Méthode appelée quand une intervention en cours a été mise à jour ou ajoutée
        this.proxy.client.newInterventionData = function (interventionData) {
            _this.onReceiveInterventionData(interventionData, false);
        };
        this.proxy.client.newSearchResults = function (searchResults) {
            console.log("Receiving search results:");
            _this.onReceiveInterventionList(searchResults);
        };
        this.proxy.client.newChatMessage = function (numFi, message) {
            _this.onReceiveMessage(numFi, message);
        };
        // attention le démarrage du serveur doit se faire APRES l'enregistrement des callbacks ! 
        hub.start()
            .done(function () {
            console.log("Connecté, transport = " + hub.transport.name + ", connection id = " + hub.id);
            _this.onConnected();
        })
            .fail(function (e) {
            console.error('Connexion au serveur impossible.');
            console.error(e);
        });
    };
    // fonction appelée au moment de la connection au serveur
    InterventionService.prototype.onConnected = function () {
        // chargement automatique des interventions en cours à la connection:
        this.loadCurrentInterventionList();
        // chargement de la liste des types de mains courantes:
        this.loadTypeMaincour();
        // chargement de la liste des libelles divers du M1, car ils sont utilisés par certaiens maincourante generies:
        this.loadM1LibelleDivers();
    };
    /** Cette fonction charge les interventions qui sont en cours
     * Toutes les données des interventions ne sont pas chargés: seulement les données essentielles.
     * Remarque: cette méthode est automatiquement appelée à la connection.
     */
    InterventionService.prototype.loadCurrentInterventionList = function () {
        var _this = this;
        this.proxy.server.queryCurrentFI()
            .done(function (newInterventions) { return _this.onReceiveInterventionList(newInterventions); })
            .fail(function (e) {
            console.error('Erreur lors de la récupération des interventions courrantes.');
            console.error(e);
        });
    };
    /**
     * Arrivée d'un lot d'interventions depuis le serveur
     */
    InterventionService.prototype.onReceiveInterventionList = function (newInterventions) {
        console.log(newInterventions.length + " interventions reçues.");
        var updatedCount = 0;
        var createdCount = 0;
        // ajout des interventions au dico:
        for (var _i = 0, newInterventions_1 = newInterventions; _i < newInterventions_1.length; _i++) {
            var inter = newInterventions_1[_i];
            this.onReceiveInterventionData(inter, false);
        }
    };
    /**
     * Arrivée d'un message de chat sur un numéro de fiche
     */
    InterventionService.prototype.onReceiveMessage = function (numFi, message) {
        console.log("Receiving new message for intervention " + numFi + ": " + message.Texte);
        var messageInter = this.loadedInterventionsDico.getValue(numFi);
        if (messageInter != null) {
            messageInter.Chat.push(message);
            this.newMessagesSource.next([messageInter, message]);
        }
    };
    /**
     * Log au serveur avec le compte utilisateur et un mot de passe
     * @param login
     * @param password
     */
    InterventionService.prototype.connect = function (login, password) {
        this.login = login;
        this.password = password;
        // vérification de la validité du login / password
        if (this.login && this.login != "" && this.password && this.password != "") {
            // TODO: se connecter au serveur
            this.m1Connected = true;
            this.plottiConnected = true;
            return true;
        }
        return false;
    };
    /**
     * Délog au serveur, en fait on reste toujours connecté à ce dernier
     */
    InterventionService.prototype.delog = function () {
        this.m1Connected = false;
        this.plottiConnected = false;
        this.login = null;
        return true;
    };
    InterventionService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    /**
     * Fonction de récupération des interventions courantes
     */
    InterventionService.prototype.getInterventions = function () {
        if (this.config && this.login && this.config.imainter.useDemoData == true)
            return this.demoData.InterventionList;
        if (this.Connected) {
            var interventions = this.loadedInterventionsDico.values();
            return interventions;
        }
        else
            return [];
    };
    Object.defineProperty(InterventionService.prototype, "MyInterventions", {
        get: function () {
            var _this = this;
            var currentInterventions = this.getInterventions();
            var interList = currentInterventions.filter(function (i) { return _this.operatorNameEqual(i.Operateur) && i.Etat != enums_1.Etat.Close; });
            return interList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionService.prototype, "OtherInterventions", {
        get: function () {
            var _this = this;
            var otherInterventions = this.getInterventions().filter(function (i) { return (!i.Operateur || !_this.operatorNameEqual(i.Operateur)) && i.Etat != enums_1.Etat.Close && i.Etat != enums_1.Etat.Annulee; });
            return otherInterventions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionService.prototype, "CloseInterventions", {
        get: function () {
            var closed = this.getInterventions().filter(function (i) { return i.Etat == enums_1.Etat.Close || i.Etat == enums_1.Etat.Annulee; });
            return closed;
        },
        enumerable: true,
        configurable: true
    });
    InterventionService.prototype.operatorNameEqual = function (name) {
        // console.log("name: " + name + " login:" + this.login);
        return this.login && name && name.toLowerCase() == this.login.toLowerCase();
    };
    /**
     * Permet de récupérer tout le détail d'une intervention
     */
    InterventionService.prototype.getFullIntervention = function (numFI, siteId) {
        var _this = this;
        if (siteId === void 0) { siteId = null; }
        if (this.useDemoData) {
            // on retourne l'intervention 1 du fichier de démo
            this.onReceiveInterventionData(this.demoData.Intervention1, true);
            return null;
        }
        if (this.Connected) {
            var interState = this.getInterventionState(numFI);
            if (interState && interState.Loaded) {
                // intervention déjà chargée, on retourne la même intervention
                return new Promise(function (resolve) { return _this.loadedInterventionsDico[numFI]; });
            }
            else {
                // récupération de l'intervention auprès des services de sa majesté IMAInter
                return this.getInterventionFromServer(numFI, siteId);
            }
        }
    };
    /**
     * Attend la prochaine reconnexion
     */
    InterventionService.prototype.waitForReconnection = function () {
        var _this = this;
        var reconnectionPromise = new Promise(function (resolve, reject) {
            if (!_this.Connected)
                _this.reconnectionResolve = resolve;
            else
                resolve();
        });
        // on retourne la promesse afin de pouvoir enchaine les promesses
        return reconnectionPromise;
    };
    /**
     * Charge une intervention
     * numFI : numéro de fiche
     */
    InterventionService.prototype.connectAndLoadIntervention = function (numFI) {
        var _this = this;
        var loadInterventionPromise = this.waitForReconnection().then(function () {
            return _this.getFullIntervention(numFI, null);
        });
        return loadInterventionPromise;
    };
    /**
     * @param numFI getInterventionFromServer
     */
    InterventionService.prototype.getInterventionFromServer = function (numFI, siteId) {
        var _this = this;
        var getInterPromise = new Promise(function (resolve, reject) {
            _this.proxy.server.getIntervention(numFI, siteId)
                .done(function (interventionWithDetails) {
                var interventionMerged = _this.onReceiveInterventionData(interventionWithDetails, true);
                resolve(interventionMerged);
            })
                .fail(function (e) {
                console.error("Erreur lors de la récupération de l'intervention " + numFI);
                console.error(e);
                reject(e);
            });
        });
        return getInterPromise;
    };
    /**
     * Appelé lorsqu'une nouvelle intervention a été reçu par le service.
     */
    InterventionService.prototype.onReceiveInterventionData = function (interData, fullIntervention) {
        // on logue les données reçues: l'intervention
        console.log("Receiving " + (fullIntervention ? "FULL" : "PARTIAL") + " intervention data :");
        console.log(interData);
        var updatedInter = null;
        var interState;
        // cas de données d'intervention déjà chargée en mémoire
        if (this.loadedInterventionsDico.containsKey(interData.Id)) {
            // on met à jour l'intervention que nous avons actuellement en mémoire (elle n'est pas remplacée)
            updatedInter = this.loadedInterventionsDico.getValue(interData.Id);
            // one ne merge pas directement dans l'objet en mémoire car dans le process des objets peuvent être mis à null, on merge via une copie
            Lodash.merge(updatedInter, interData);
            // état de l'intervention
            interState = this.interventionsStateDico.getValue(interData.Id);
            interState.Loaded = interState.Loaded || fullIntervention;
        }
        else {
            interState = this.interventionsStateDico.setValue(interData.Id, { Loaded: fullIntervention, Selected: false });
            // création d'une nouvelle intervention, on merge dedans les data qu'on a reçues
            var newIntervention = new Intervention_1.Intervention();
            Lodash.merge(newIntervention, interData);
            this.loadedInterventionsDico.setValue(interData.Id, newIntervention);
            updatedInter = newIntervention;
        }
        // on notifie les intéressés que de nouvelles data sont reçues sur une intervention:
        this.newInterDataSource.next(interData);
        return updatedInter;
    };
    /**
     * Permet de récupérer l'état d'une intervention chargée. Il s'agit d'une donnée interne au client.
     */
    InterventionService.prototype.getInterventionState = function (id) {
        return this.interventionsStateDico.getValue(id);
    };
    Object.defineProperty(InterventionService.prototype, "useDemoData", {
        get: function () {
            return this.config && this.config.imainter && this.config.imainter.useDemoData == true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Récupère les données de démo dans le fichier de démo json
     */
    InterventionService.prototype.getDemoData = function () {
        var _this = this;
        this.http.get("data/demoData.json").toPromise()
            .then(function (response) {
            _this.demoData = response.json();
        })
            .catch(function (reason) { return console.log(reason); });
    };
    /**
     * Récupère la liste des types de maincourantes d'interventions
     */
    InterventionService.prototype.loadTypeMaincour = function () {
        var _this = this;
        this.proxy.server.loadTypeMaincour()
            .done(function (typesMainCour) {
            console.log("Réception des types de mains courantes d'intervention.");
            // on garde la liste en mémoire dans le service, la vue pourra se bind directement dessus
            typesMainCour.map(function (tmc) { _this.listeTypeMaincour[tmc.Type] = tmc.Libelle; });
            // log les libellés:
            //this.listeTypeMaincour.forEach( i => { console.log(this.listeTypeMaincour.indexOf(i) + ':' + i); } );
        })
            .fail(function (e) {
            console.error('Erreur lors de la récupération des types de mains courantes d\'interventions.');
            console.error(e);
        });
    };
    /**
     * Récupère la liste des types de maincourantes d'interventions
     */
    InterventionService.prototype.loadM1LibelleDivers = function () {
        var _this = this;
        this.proxy.server.loadM1LibelleDivers()
            .done(function (m1LibelleDivers) {
            console.log("Réception des libellés divers M1.");
            // on garde la liste en mémoire dans le service, la vue pourra se binder directement dessus
            m1LibelleDivers.map(function (lib) { _this.listeM1LibelleDivers[lib.Type] = lib.Libelle; });
            // log les libellés:
            // this.listeTypeMaincour.forEach( i => { console.log(this.listeTypeMaincour.indexOf(i) + ':' + i); } );
        })
            .fail(function (e) {
            console.error('Erreur lors de la récupération des libellés divers du M1.');
            console.error(e);
        });
    };
    /**
     * Ajout d'une nouvelle main courante
     * @param numFi : numéro de la fiche
     * @param typeMaincour : type de main courante
     * @param comment : commentaire
     */
    InterventionService.prototype.addNewMaincourante = function (numFi, typeMaincour, comment) {
        console.log("Envoi d'une main courante au serveur: ");
        console.log({ "userId": this.userId, "numFi": numFi, "typeMaincour": typeMaincour, "comment": comment });
        this.proxy.server.addNewMaincourante(this.userId, numFi, typeMaincour, comment);
    };
    /**
     * Envoi d'un changement d'intervention
     * @param jsonInterChange : les changements
     */
    InterventionService.prototype.sendInterChange = function (jsonInterChange) {
        console.log("Envoi d'un changement d'intervention: " + jsonInterChange);
        console.log(jsonInterChange);
        this.proxy.server.sendInterChange(jsonInterChange);
    };
    /**
     * Recheche des anciennes interventions avec la requête suivante
     * @param queryString string
     */
    InterventionService.prototype.searchInterventions = function (queryString) {
        this.clearSearchResults();
        if (queryString) {
            console.log("Recherche des anciennes interventions avec la requ\u00EAte suivante: '" + queryString + "'");
            this.proxy.server.searchInterventions(queryString);
        }
    };
    /**
     * Efface les résultats de la recherche
     */
    InterventionService.prototype.clearSearchResults = function () {
        var searchResult = this.loadedInterventionsDico.values().filter(function (i) { return i.Etat == enums_1.Etat.Close || i.Etat == enums_1.Etat.Annulee; });
        for (var _i = 0, searchResult_1 = searchResult; _i < searchResult_1.length; _i++) {
            var i = searchResult_1[_i];
            this.loadedInterventionsDico.remove(i.Id);
        }
    };
    InterventionService.prototype.submit = function (intervention) {
        console.log("Demande de transmission de la fiche " + intervention.Id + ".");
        this.proxy.server.submit(intervention.Id);
    };
    InterventionService.prototype.close = function (intervention) {
        console.log("Demande de cl\u00F4ture de la fiche " + intervention.Id + ".");
        this.proxy.server.close(intervention.Id);
    };
    InterventionService.prototype.cancel = function (intervention) {
        console.log("Demande d'annulation de la fiche " + intervention.Id + ".");
        this.proxy.server.cancel(intervention.Id);
    };
    InterventionService.prototype.chat = function (numFi, message) {
        console.log("Envoi messages sur FI " + numFi + ", op\u00E9rateur: " + this.login + ", texte: " + message);
        this.proxy.server.chat(numFi, this.login, message);
    };
    return InterventionService;
}());
InterventionService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], InterventionService);
exports.InterventionService = InterventionService;
//# sourceMappingURL=intervention.service.js.map
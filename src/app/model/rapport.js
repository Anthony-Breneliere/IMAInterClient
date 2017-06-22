"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rapport_trajet_1 = require("./rapport_trajet");
var rapport_verifications_1 = require("./rapport_verifications");
var rapport_presence_1 = require("./rapport_presence");
var rapport_mise_en_securite_1 = require("./rapport_mise_en_securite");
var rapport_arrivee_sur_lieux_1 = require("./rapport_arrivee_sur_lieux");
/**
 * Created by abreneli on 09/08/2016.
 */
var Rapport = (function () {
    function Rapport() {
        this.ArriveeSurLieux = new rapport_arrivee_sur_lieux_1.RapportArriveeSurLieux();
        this.Verifications = new rapport_verifications_1.RapportVerifications();
        this.MiseEnSecurite = new rapport_mise_en_securite_1.RapportMiseEnSecurite();
        this.Presence = new rapport_presence_1.RapportPresence();
        this.Trajet = new rapport_trajet_1.RapportTrajet();
    }
    Object.defineProperty(Rapport.prototype, "ArriveeSurLieuxN", {
        get: function () { return this.ArriveeSurLieux ? this.ArriveeSurLieux : this.ArriveeSurLieux = new rapport_arrivee_sur_lieux_1.RapportArriveeSurLieux(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rapport.prototype, "VerificationsN", {
        get: function () { return this.Verifications ? this.Verifications : this.Verifications = new rapport_verifications_1.RapportVerifications(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rapport.prototype, "MiseEnSecuriteN", {
        get: function () { return this.MiseEnSecurite ? this.MiseEnSecurite : this.MiseEnSecurite = new rapport_mise_en_securite_1.RapportMiseEnSecurite(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rapport.prototype, "PresenceN", {
        get: function () { return this.Presence ? this.Presence : this.Presence = new rapport_presence_1.RapportPresence(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rapport.prototype, "TrajetN", {
        get: function () { return this.Trajet ? this.Trajet : this.Trajet = new rapport_trajet_1.RapportTrajet(); },
        enumerable: true,
        configurable: true
    });
    return Rapport;
}());
exports.Rapport = Rapport;
//# sourceMappingURL=rapport.js.map
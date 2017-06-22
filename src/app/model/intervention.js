"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fiche_qualite_1 = require("./fiche_qualite");
var rapport_1 = require("./rapport");
var enums_1 = require("./enums");
var alarme_1 = require("./alarme");
var intervenant_1 = require("./intervenant");
var site_1 = require("./site");
/**
 * Created by abreneli on 01/07/2016.
 */
var Intervention = (function () {
    /**
     *
     * @param jsonData Données d'intervention
     */
    function Intervention() {
        this.Site = new site_1.Site();
        this.Alarme = new alarme_1.Alarme();
        this.FicheQualite = new fiche_qualite_1.FicheQualite();
        this.Intervenant = new intervenant_1.Intervenant();
        this.Rapport = new rapport_1.Rapport();
        this.Chat = new Array();
    }
    Object.defineProperty(Intervention.prototype, "SiteN", {
        get: function () { return this.Site ? this.Site : this.Site = new site_1.Site(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Intervention.prototype, "AlarmeN", {
        get: function () { return this.Alarme ? this.Alarme : this.Alarme = new alarme_1.Alarme(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Intervention.prototype, "FicheQualiteN", {
        get: function () { return this.FicheQualite ? this.FicheQualite : this.FicheQualite = new fiche_qualite_1.FicheQualite(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Intervention.prototype, "IntervenantN", {
        get: function () { return this.Intervenant ? this.Intervenant : this.Intervenant = new intervenant_1.Intervenant(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Intervention.prototype, "RapportN", {
        get: function () { return this.Rapport ? this.Rapport : this.Rapport = new rapport_1.Rapport(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Intervention.prototype, "MainCourantesN", {
        get: function () { return this.MainCourantes ? this.MainCourantes : this.MainCourantes = new Array(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Intervention.prototype, "EtatLabel", {
        // propriétés permettant d'afficher le label des énumérations
        get: function () {
            if (this.Etat != null)
                return enums_1.Etat[this.Etat];
            else
                return null;
        },
        // ajoute des setters pour éviter les exceptions lors de la recopie automatique
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Intervention.prototype, "OrigineLabel", {
        get: function () {
            if (this.Origine != null)
                return enums_1.OrigineFiche[this.Origine];
            else
                return null;
        },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Intervention.prototype, "TypeFicheLabel", {
        get: function () {
            if (this.TypeFiche)
                return enums_1.TypeFiche[this.TypeFiche];
            else
                return null;
        },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    return Intervention;
}());
exports.Intervention = Intervention;
//# sourceMappingURL=intervention.js.map
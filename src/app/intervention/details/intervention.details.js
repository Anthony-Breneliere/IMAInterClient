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
var Lodash = require("lodash");
// import 'jquery-ui';
//import 'gridstack';
/**
 * Created by abreneli on 01/07/2016.
 */
var core_1 = require("@angular/core");
var intervention_1 = require("../../model/intervention");
var enums_1 = require("../../model/enums");
var intervention_service_1 = require("../../services/intervention.service");
var InterventionDetails = (function () {
    function InterventionDetails(r, el, interService, ref) {
        this.r = r;
        this.el = el;
        this.interService = interService;
        this.ref = ref;
        // liste des enums
        this.MotifIntervention = enums_1.MotifIntervention;
        this.MotifInterventionValues = Object.values(enums_1.MotifIntervention).filter(function (e) { return typeof (e) == "number"; });
        this.Trajet = enums_1.Trajet;
        this.TrajetValues = Object.values(enums_1.Trajet).filter(function (e) { return typeof (e) == "number"; });
        this.TypePresence = enums_1.TypePresence;
        this.TypePresenceValues = Object.values(enums_1.TypePresence).filter(function (e) { return typeof (e) == "number"; });
        this.DepotBonIntervention = enums_1.DepotBonIntervention;
        this.DepotBonInterventionValues = Object.values(enums_1.DepotBonIntervention).filter(function (e) { return typeof (e) == "number"; });
        this.TypeSite = enums_1.TypeSite;
        this.TypeSiteValues = Object.values(enums_1.TypeSite).filter(function (e) { return typeof (e) == "number"; });
        this.CircuitVerification = enums_1.CircuitVerification;
        this.CircuitVerificationValues = Object.values(enums_1.CircuitVerification).filter(function (e) { return typeof (e) == "number"; });
        this.motifChoices = [];
        // saisie d'une matin courante:
        this.selectedMaincourType = -1;
        this.maincourComment = "";
        this.gridStackInit = false;
        // on transforme l'enum MotifIntervention en une structure clé/valeur qu'on peut binder
        this.motifChoices = Object.values(enums_1.MotifIntervention).filter(function (e) { return typeof (e) == "number"; });
    }
    Object.defineProperty(InterventionDetails.prototype, "intervention", {
        get: function () { return this._intervention; },
        set: function (value) {
            var _this = this;
            this._intervention = value;
            // à chaque changement d'intervention affichée le composant s'abonne aux changements de l'intervention correspondante
            if (this.interventionChangeSubscription)
                this.interventionChangeSubscription.unsubscribe();
            this.interventionChangeSubscription =
                this.interService.newInterData$.filter(function (i) { return _this.intervention && _this.intervention.Id == i.Id; }).subscribe(function (i) { return _this.detectChanges(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "rapport", {
        get: function () { return this.intervention.RapportN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "intervenant", {
        get: function () { return this.intervention.IntervenantN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "site", {
        get: function () { return this.intervention.SiteN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "trajet", {
        get: function () { return this.rapport.TrajetN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "presence", {
        get: function () { return this.rapport.PresenceN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "miseEnSecurite", {
        get: function () { return this.rapport.MiseEnSecuriteN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "verifications", {
        get: function () { return this.rapport.VerificationsN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "arriveeSurLieux", {
        get: function () { return this.rapport.ArriveeSurLieuxN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "nonAccesAuSite", {
        get: function () { return this.arriveeSurLieux.RapportNonAccesAuSiteN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "quellesLumieresAllumees", {
        get: function () { return this.rapport.VerificationsN.QuellesLumieresAllumeesN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "quellesIssuesOuvertes", {
        get: function () { return this.rapport.VerificationsN.QuellesIssuesOuvertesN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "quellesEffractions", {
        get: function () { return this.rapport.VerificationsN.QuellesEffractionsN; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "listMainCour", {
        get: function () { return this.intervention ? this.intervention.MainCourantes : null; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(InterventionDetails.prototype, "listTypeMainCour", {
        get: function () {
            return this.listTypeMainCourCache || (this.listTypeMainCourCache = ['']
                .concat(this.interService.listeTypeMaincour.filter(function (v) { return v != undefined; })));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Fonction appelée lorqu'un changement a lieu sur la fiche, ceci est nécessaire à cause de la stratégie de détection des changements paramétrée sur le composant:
     * changeDetection : ChangeDetectionStrategy.OnPush
     */
    InterventionDetails.prototype.detectChanges = function () {
        this.ref.markForCheck();
    };
    Object.defineProperty(InterventionDetails.prototype, "AutrePieceChecked", {
        get: function () {
            return this.quellesLumieresAllumees.Autre != null;
        },
        set: function (value) {
            this.changeRapport({ Verifications: { QuellesLumieresAllumees: { Autre: value ? '' : null } } });
            this.quellesLumieresAllumees.Autre = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "AutreIssueChecked", {
        get: function () {
            return this.quellesIssuesOuvertes.Autre != null;
        },
        set: function (value) {
            this.changeRapport({ Verifications: { QuellesIssuesOuvertes: { Autre: value ? '' : null } } });
            this.quellesIssuesOuvertes.Autre = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "AutreEffractionChecked", {
        get: function () {
            return this.quellesEffractions.Autre != null;
        },
        set: function (value) {
            this.changeRapport({ Verifications: { QuellesEffractions: { Autre: value ? '' : null } } });
            this.quellesEffractions.Autre = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "AutrePresenceChecked", {
        get: function () {
            return this.presence.AutrePresence != null;
        },
        set: function (value) {
            this.changeRapport({ Presence: { AutrePresence: value ? '' : null } });
            this.presence.AutrePresence = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "PresenceVehiculeChecked", {
        get: function () {
            return this.presence.TypeVehicule != null;
        },
        set: function (value) {
            this.changeRapport({ Presence: { TypeVehicule: value ? '' : null, CouleurVehicule: value ? '' : null, PlaqueVehicule: value ? '' : null } });
            this.presence.TypeVehicule = value ? "" : null;
            this.presence.CouleurVehicule = value ? "" : null;
            this.presence.PlaqueVehicule = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "MiseEnPlaceDemandeeParChecked", {
        get: function () {
            return this.miseEnSecurite.MiseEnPlaceDemandeePar != null;
        },
        set: function (value) {
            this.changeRapport({ MiseEnSecurite: { MiseEnPlaceDemandeePar: value ? '' : null } });
            this.miseEnSecurite.MiseEnPlaceDemandeePar = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionDetails.prototype, "MiseEnPlaceAnimalChecked", {
        get: function () {
            return this.miseEnSecurite.MiseEnPlaceAnimal != null;
        },
        set: function (value) {
            this.changeRapport({ MiseEnSecurite: { MiseEnPlaceAnimal: value ? '' : null } });
            this.miseEnSecurite.MiseEnPlaceAnimal = value ? "" : null;
        },
        enumerable: true,
        configurable: true
    });
    InterventionDetails.prototype.ngAfterViewChecked = function () {
        //  L'appel de la fonction gridstack permet de rendre les composants de la doit être faite après la construction complète de la vue
        // console.log("column number : " + this.ColumnNumber);
        // var options = { width: this.ColumnNumber };
        // let grid = jQuery('.grid-stack').gridstack(options); 
    };
    InterventionDetails.prototype.getTypeMaincourValue = function (key) {
        // retourne le libellé du type de main courante ou "inconnu" si le type n'existe pas:
        return this.interService.listeTypeMaincour[key] || this.interService.listeM1LibelleDivers[key] || "inconnu";
    };
    InterventionDetails.prototype.getTypeMaincourKey = function (value) {
        // retourne le libellé du type de main courante ou "inconnu" si le type n'existe pas:
        return this.interService.listeTypeMaincour.indexOf(value);
    };
    InterventionDetails.prototype.isChecked = function (value) {
        return this.intervention.Rapport.MotifIntervention == value;
    };
    InterventionDetails.prototype.ngOnInit = function () {
        // this.intervention = this.interService.getIntervention( 0 );
    };
    InterventionDetails.prototype.Capitalize = function (text) {
        return text != null ?
            text.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function (l) { return l.toUpperCase(); })
            : null;
    };
    InterventionDetails.prototype.TelMail = function (label, text) {
        if (label == null || text == null)
            return label;
        var result = "";
        if (text.match(/[_A-Za-z0-9-\.]+@[_A-Za-z0-9-\.]+/) != null)
            result += "Mél ";
        if (text.match(/[0-9]+/) != null)
            result += "Tel ";
        result += label.replace(/_/g, " ").replace(/telephone/g, "").toLowerCase();
        return result;
    };
    InterventionDetails.prototype.addNewMaincourante = function () {
        if (this.selectedMaincourType == -1) {
            // toto animation pour higlighter la sélection du type de main courante
            return;
        }
        else {
            this.interService.addNewMaincourante(this.intervention.Id, this.selectedMaincourType, this.maincourComment);
        }
    };
    InterventionDetails.prototype.changeVerifIntegraleIssues = function (event) {
        console.log(event);
    };
    Object.defineProperty(InterventionDetails.prototype, "displayRaisonNonVerificationIssues", {
        get: function () {
            return this.arriveeSurLieux.VerifIntegraleIssues;
        },
        enumerable: true,
        configurable: true
    });
    InterventionDetails.prototype.changeRapport = function (data) {
        var _this = this;
        console.log(data);
        var p = new Promise(function (resolve) {
            Lodash.merge(_this.rapport, data);
            // envoi du changement dans le rapport
            _this.interService.sendInterChange({ Id: _this.intervention.Id, Rapport: data });
        });
    };
    InterventionDetails.prototype.changeRapport2 = function (ref, data) {
        var _this = this;
        // console.log( ref.nativeElement );
        console.log(data);
        var p = new Promise(function (resolve) {
            Lodash.merge(_this.rapport, data);
            // envoi du changement dans le rapport
            _this.interService.sendInterChange({ Id: _this.intervention.Id, Rapport: data });
        });
    };
    return InterventionDetails;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", intervention_1.Intervention),
    __metadata("design:paramtypes", [intervention_1.Intervention])
], InterventionDetails.prototype, "intervention", null);
InterventionDetails = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'intervention-details',
        templateUrl: './intervention.details.html',
        styleUrls: ['./intervention.details.css', '../../../node_modules/gridstack/dist/gridstack.css'],
        // pour des raisons de performence, les champs ne seront mis à jour que sur un appel de onChangeCallback
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.Renderer, core_1.ElementRef, intervention_service_1.InterventionService, core_1.ChangeDetectorRef])
], InterventionDetails);
exports.InterventionDetails = InterventionDetails;
//# sourceMappingURL=intervention.details.js.map
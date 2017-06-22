/**
 * Created by abreneli on 04/07/2016.
 */
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
var core_1 = require("@angular/core");
var intervention_group_1 = require("../groupe/intervention.group");
var enums_1 = require("../../model/enums");
var intervention_service_1 = require("../../services/intervention.service");
var router_1 = require("@angular/router");
require("rxjs/add/operator/switchMap");
var InterventionMainDisplay = (function () {
    function InterventionMainDisplay(interventionService, route) {
        this.interventionService = interventionService;
        this.route = route;
        this.GroupTypeEnum = intervention_group_1.GroupTypeEnum; // <- using enum in html
    }
    InterventionMainDisplay.prototype.ngOnInit = function () {
        var _this = this;
        // a l'initialisation du composant, le paramètre id de l'url est lue de manière à charger
        // puis à afficher l'intervention correspondante.
        this.route.params
            .switchMap(function (params) { return [+params['id']]; })
            .subscribe(function (id) {
            _this.urlInterventionId = id;
            if (_this.urlInterventionId > 0) {
                _this.interventionService.connectAndLoadIntervention(_this.urlInterventionId)
                    .then(function (inter) { _this.selectedIntervention = inter; _this.deployGroup(inter); })
                    .catch(function (reason) { console.error("erreur de chargement de l'intervention: " + reason); });
            }
        });
    };
    InterventionMainDisplay.prototype.ngAfterViewInit = function () {
        // code exécuté après l'initialisation des vues @ViewChild
        console.log("InterventionMainDisplay.ngAfterViewInit");
    };
    Object.defineProperty(InterventionMainDisplay.prototype, "selectedIntervention", {
        get: function () {
            // si on a un bouton qui est sélectionné alors on prend l'intervention du bouton
            return this._selectedIntervention;
        },
        set: function (value) {
            this._selectedIntervention = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Le groupe de l'intervention doit toujours être sélectionné
     */
    InterventionMainDisplay.prototype.deployGroup = function (inter) {
        if (inter.Etat != enums_1.Etat.Close) {
            if (inter.Operateur == this.interventionService.login)
                this.myGroup.Expanded = true;
            else
                this.othersGroup.Expanded = true;
        }
        else {
            this.searchGroup.Expanded = true;
        }
    };
    InterventionMainDisplay.prototype.onSelectedButton = function (newSelectedButton) {
        if (this.selectedButton != newSelectedButton) {
            this.selectedButton = newSelectedButton;
            this.selectedIntervention = newSelectedButton.intervention;
            // un bouton d'intervention a été cliqué, je charge l'intervention si elle n'est pas chargée
            var interSelected = this.selectedButton.intervention;
            // récupération de l'intervention auprès des services de sa majesté IMAInter
            // chargement de l'intervention complètege effectué dans le ngOnInit, on désactive celle-ci:
            // this.interventionService.getFullIntervention( interSelected.Id, interSelected.Site ? interSelected.Site.Id : null);
        }
    };
    return InterventionMainDisplay;
}());
__decorate([
    core_1.ViewChild("myGroup"),
    __metadata("design:type", intervention_group_1.InterventionGroup)
], InterventionMainDisplay.prototype, "myGroup", void 0);
__decorate([
    core_1.ViewChild("othersGroup"),
    __metadata("design:type", intervention_group_1.InterventionGroup)
], InterventionMainDisplay.prototype, "othersGroup", void 0);
__decorate([
    core_1.ViewChild("searchGroup"),
    __metadata("design:type", intervention_group_1.InterventionGroup)
], InterventionMainDisplay.prototype, "searchGroup", void 0);
InterventionMainDisplay = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'intervention-main-display',
        templateUrl: './intervention.main_display.html',
        styleUrls: ['./intervention.main_display.css'],
    }),
    __metadata("design:paramtypes", [intervention_service_1.InterventionService,
        router_1.ActivatedRoute])
], InterventionMainDisplay);
exports.InterventionMainDisplay = InterventionMainDisplay;
//# sourceMappingURL=intervention.main_display.js.map
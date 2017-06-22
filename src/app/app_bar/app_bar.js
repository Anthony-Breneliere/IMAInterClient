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
var intervention_service_1 = require("../services/intervention.service");
var AppBar = (function () {
    function AppBar(interService) {
        this.interService = interService;
        this.ConnectionPanelDisplayed = false;
        this.TSLogin = "";
        this.TSPassword = "";
    }
    AppBar.prototype.m1State = function () {
        return this.interService.m1Connected ? 'connected' : 'disconnected';
    };
    AppBar.prototype.plottiState = function () {
        return this.interService.plottiConnected ? 'connected' : 'disconnected';
    };
    Object.defineProperty(AppBar.prototype, "connectedState", {
        get: function () {
            return this.interService.Connected ? 'connected' : 'disconnected';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppBar.prototype, "connectedLabel", {
        get: function () {
            return this.interService.Connected ? 'Connected' : 'Disconnected';
        },
        enumerable: true,
        configurable: true
    });
    AppBar.prototype.connect = function () {
        if (this.interService.connect(this.TSLogin, this.TSPassword))
            this.ConnectionPanelDisplayed = false;
    };
    AppBar.prototype.disconnect = function () {
        if (this.interService.delog())
            this.ConnectionPanelDisplayed = false;
    };
    AppBar.prototype.clickConnectionPanel = function () {
        this.ConnectionPanelDisplayed = !this.ConnectionPanelDisplayed;
    };
    return AppBar;
}());
AppBar = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'app-bar',
        templateUrl: './app_bar.html',
        styleUrls: ['./app_bar.css']
    }),
    __metadata("design:paramtypes", [intervention_service_1.InterventionService])
], AppBar);
exports.AppBar = AppBar;
//# sourceMappingURL=app_bar.js.map
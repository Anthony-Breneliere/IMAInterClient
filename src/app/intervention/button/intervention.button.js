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
 * Created by abreneli on 01/07/2016.
 */
var core_1 = require("@angular/core");
var angular2_contextmenu_1 = require("angular2-contextmenu");
var intervention_1 = require("../../model/intervention");
var intervention_service_1 = require("../../services/intervention.service");
var InterventionButton = (function () {
    function InterventionButton(interService) {
        this.interService = interService;
        this.onSelected = new core_1.EventEmitter();
    }
    InterventionButton.prototype.onClickInter = function () {
        // dans le cas où le bouton est sélectionné on prévient le composant parent pour la désélection
        this.onSelected.emit(this);
    };
    InterventionButton.prototype.submit = function () {
        this.interService.submit(this.intervention);
    };
    InterventionButton.prototype.close = function () {
        this.interService.close(this.intervention);
    };
    InterventionButton.prototype.cancel = function () {
        this.interService.cancel(this.intervention);
    };
    Object.defineProperty(InterventionButton.prototype, "canSubmit", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionButton.prototype, "canClose", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterventionButton.prototype, "canCancel", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return InterventionButton;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", intervention_1.Intervention)
], InterventionButton.prototype, "intervention", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], InterventionButton.prototype, "selected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], InterventionButton.prototype, "onSelected", void 0);
__decorate([
    core_1.ViewChild(angular2_contextmenu_1.ContextMenuComponent),
    __metadata("design:type", angular2_contextmenu_1.ContextMenuComponent)
], InterventionButton.prototype, "buttonMenu", void 0);
InterventionButton = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'intervention-button',
        templateUrl: './intervention.button.html',
        styleUrls: ['./intervention.button.css']
    }),
    __metadata("design:paramtypes", [intervention_service_1.InterventionService])
], InterventionButton);
exports.InterventionButton = InterventionButton;
//# sourceMappingURL=intervention.button.js.map
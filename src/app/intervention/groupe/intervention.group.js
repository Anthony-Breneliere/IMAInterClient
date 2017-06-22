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
var intervention_1 = require("../../model/intervention");
var intervention_service_1 = require("../../services/intervention.service");
var GroupTypeEnum;
(function (GroupTypeEnum) {
    GroupTypeEnum[GroupTypeEnum["mesInterventions"] = 0] = "mesInterventions";
    GroupTypeEnum[GroupTypeEnum["autresInterventions"] = 1] = "autresInterventions";
    GroupTypeEnum[GroupTypeEnum["interventionsCloses"] = 2] = "interventionsCloses";
})(GroupTypeEnum = exports.GroupTypeEnum || (exports.GroupTypeEnum = {}));
var InterventionGroup = (function () {
    function InterventionGroup(interService) {
        this.interService = interService;
        this.onSelectedButton = new core_1.EventEmitter();
        this.GroupTypeEnum = GroupTypeEnum; // <- using enum in html
    }
    InterventionGroup.prototype.groupInterventions = function () {
        switch (this.GroupType) {
            case GroupTypeEnum.interventionsCloses:
                return this.interService.CloseInterventions;
            case GroupTypeEnum.autresInterventions:
                return this.interService.OtherInterventions;
            default:
                return this.interService.MyInterventions;
        }
    };
    InterventionGroup.prototype.onClickHeader = function () {
        this.Expanded = !this.Expanded;
    };
    InterventionGroup.prototype.onSelected = function (newSelectedButton) {
        // on relaie le bouton sélectionné au composant parent:
        this.onSelectedButton.emit(newSelectedButton);
    };
    InterventionGroup.prototype.searchInterventions = function (queryString) {
        // on recherche les interventions à partir de 4 caractères saisis
        if (queryString.length >= 4) {
            this.interService.searchInterventions(queryString);
        }
    };
    return InterventionGroup;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InterventionGroup.prototype, "GroupName", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], InterventionGroup.prototype, "GroupType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", intervention_1.Intervention)
], InterventionGroup.prototype, "SelectedIntervention", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], InterventionGroup.prototype, "Expanded", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], InterventionGroup.prototype, "onSelectedButton", void 0);
InterventionGroup = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'intervention-group',
        templateUrl: './intervention.group.html',
        styleUrls: ['./intervention.group.css']
    }),
    __metadata("design:paramtypes", [intervention_service_1.InterventionService])
], InterventionGroup);
exports.InterventionGroup = InterventionGroup;
//# sourceMappingURL=intervention.group.js.map
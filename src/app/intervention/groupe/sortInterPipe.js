/**
 * Created by abreneli on 05/04/2017.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Tri des intervention sur la date de création de l'intervention, en ordre décroissant.
 */
var SortInterventionByDateTime = (function () {
    function SortInterventionByDateTime() {
    }
    SortInterventionByDateTime.prototype.transform = function (interList) {
        var sortedList = interList.sort(function (inter1, inter2) {
            if (inter1.Creation < inter2.Creation)
                return 1;
            if (inter1.Creation > inter2.Creation)
                return -1;
            return 0;
        });
        return sortedList;
    };
    return SortInterventionByDateTime;
}());
SortInterventionByDateTime = __decorate([
    core_1.Pipe({
        name: 'sortInterventionByDateTime',
        pure: true // le passage à false fait ramer énormément l'appli, mais permettait de garder la liste constemment triée
        // l'astuce pour garder le pipe pure a été d'ajouter en paramètre le dernier DTO dont la date a changé. Ainsi, si on change 
        // ce dto dans le composant d'historique, alors cela déclenche une réévaluation du pipe.
    })
], SortInterventionByDateTime);
exports.SortInterventionByDateTime = SortInterventionByDateTime;
//# sourceMappingURL=sortInterPipe.js.map
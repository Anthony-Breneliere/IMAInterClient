"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rapport_lumieres_1 = require("./rapport_lumieres");
var rapport_issues_concernees_1 = require("./rapport_issues_concernees");
/**
 * Created by abreneli on 09/08/2016.
 */
var RapportVerifications = (function () {
    function RapportVerifications() {
        this.QuellesLumieresAllumees = new rapport_lumieres_1.RapportLumieresAllumees();
        this.QuellesIssuesOuvertes = new rapport_issues_concernees_1.RapportIssuesConcernees();
        this.QuellesEffractions = new rapport_issues_concernees_1.RapportIssuesConcernees();
    }
    Object.defineProperty(RapportVerifications.prototype, "QuellesLumieresAllumeesN", {
        get: function () { return this.QuellesLumieresAllumees ? this.QuellesLumieresAllumees : this.QuellesLumieresAllumees = new rapport_lumieres_1.RapportLumieresAllumees(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RapportVerifications.prototype, "QuellesIssuesOuvertesN", {
        get: function () { return this.QuellesIssuesOuvertes ? this.QuellesIssuesOuvertes : this.QuellesIssuesOuvertes = new rapport_issues_concernees_1.RapportIssuesConcernees(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RapportVerifications.prototype, "QuellesEffractionsN", {
        get: function () { return this.QuellesEffractions ? this.QuellesEffractions : this.QuellesEffractions = new rapport_issues_concernees_1.RapportIssuesConcernees(); },
        enumerable: true,
        configurable: true
    });
    return RapportVerifications;
}());
exports.RapportVerifications = RapportVerifications;
//# sourceMappingURL=rapport_verifications.js.map
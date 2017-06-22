"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rapport_non_acces_au_site_1 = require("./rapport_non_acces_au_site");
var RapportArriveeSurLieux = (function () {
    function RapportArriveeSurLieux() {
        this.NonAccesAuSite = new rapport_non_acces_au_site_1.RapportNonAccesAuSite();
    }
    Object.defineProperty(RapportArriveeSurLieux.prototype, "RapportNonAccesAuSiteN", {
        get: function () { return this.NonAccesAuSite ? this.NonAccesAuSite : this.NonAccesAuSite = new rapport_non_acces_au_site_1.RapportNonAccesAuSite(); },
        enumerable: true,
        configurable: true
    });
    return RapportArriveeSurLieux;
}());
exports.RapportArriveeSurLieux = RapportArriveeSurLieux;
//# sourceMappingURL=rapport_arrivee_sur_lieux.js.map
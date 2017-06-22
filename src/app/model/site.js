"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Classe site
 */
var Site = (function () {
    function Site() {
    }
    Object.defineProperty(Site.prototype, "TelephonesN", {
        get: function () { return this.Telephones ? this.Telephones : this.Telephones = new Array(); },
        enumerable: true,
        configurable: true
    });
    Site.prototype.costructor = function () {
        this.Telephones = new Array();
    };
    return Site;
}());
exports.Site = Site;
//# sourceMappingURL=site.js.map
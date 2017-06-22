"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Intervenant = (function () {
    function Intervenant() {
        this.Telephones = new Array();
    }
    Object.defineProperty(Intervenant.prototype, "TelephonesN", {
        get: function () { return this.Telephones ? this.Telephones : this.Telephones = new Array(); },
        enumerable: true,
        configurable: true
    });
    return Intervenant;
}());
exports.Intervenant = Intervenant;
//# sourceMappingURL=intervenant.js.map
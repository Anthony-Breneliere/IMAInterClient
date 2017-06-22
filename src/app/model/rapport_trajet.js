"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rapport_meteo_1 = require("./rapport_meteo");
var RapportTrajet = (function () {
    function RapportTrajet() {
        this.Meteo = new rapport_meteo_1.RapportMeteo();
    }
    Object.defineProperty(RapportTrajet.prototype, "MeteoN", {
        get: function () { return this.Meteo ? this.Meteo : this.Meteo = new rapport_meteo_1.RapportMeteo(); },
        enumerable: true,
        configurable: true
    });
    return RapportTrajet;
}());
exports.RapportTrajet = RapportTrajet;
//# sourceMappingURL=rapport_trajet.js.map
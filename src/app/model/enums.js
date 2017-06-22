/**
 * Created by abreneli on 09/08/2016.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Etat;
(function (Etat) {
    Etat[Etat["Creee"] = 0] = "Creee";
    Etat[Etat["Transmise"] = 1] = "Transmise";
    Etat[Etat["Acceptee"] = 2] = "Acceptee";
    Etat[Etat["Dispatchee"] = 3] = "Dispatchee";
    Etat[Etat["Affectee"] = 4] = "Affectee";
    Etat[Etat["Rejetee"] = 5] = "Rejetee";
    Etat[Etat["Programmee"] = 6] = "Programmee";
    Etat[Etat["ASL"] = 7] = "ASL";
    Etat[Etat["Traitee"] = 8] = "Traitee";
    Etat[Etat["Statique"] = 9] = "Statique";
    Etat[Etat["Annulee"] = 10] = "Annulee";
    Etat[Etat["Close"] = 11] = "Close";
})(Etat = exports.Etat || (exports.Etat = {}));
var OrigineFiche;
(function (OrigineFiche) {
    OrigineFiche[OrigineFiche["AppelTelephonique"] = 0] = "AppelTelephonique";
    OrigineFiche[OrigineFiche["Essai"] = 1] = "Essai";
    OrigineFiche[OrigineFiche["TraitementAlarme"] = 2] = "TraitementAlarme";
})(OrigineFiche = exports.OrigineFiche || (exports.OrigineFiche = {}));
var TypeFiche;
(function (TypeFiche) {
    TypeFiche[TypeFiche["Intervention"] = 0] = "Intervention";
    TypeFiche[TypeFiche["Gardiennage"] = 1] = "Gardiennage";
    TypeFiche[TypeFiche["Ronde"] = 2] = "Ronde";
    TypeFiche[TypeFiche["GardiennageALaDemande"] = 3] = "GardiennageALaDemande";
})(TypeFiche = exports.TypeFiche || (exports.TypeFiche = {}));
var MotifIntervention;
(function (MotifIntervention) {
    MotifIntervention[MotifIntervention["Intrusion"] = 0] = "Intrusion";
    MotifIntervention[MotifIntervention["Identification"] = 1] = "Identification";
    MotifIntervention[MotifIntervention["AbsenceTest"] = 2] = "AbsenceTest";
    MotifIntervention[MotifIntervention["Autre"] = 3] = "Autre";
})(MotifIntervention = exports.MotifIntervention || (exports.MotifIntervention = {}));
var Trajet;
(function (Trajet) {
    Trajet[Trajet["Normal"] = 0] = "Normal";
    Trajet[Trajet["Circulation"] = 1] = "Circulation";
    Trajet[Trajet["Intemperies"] = 2] = "Intemperies";
    Trajet[Trajet["Autre"] = 3] = "Autre";
})(Trajet = exports.Trajet || (exports.Trajet = {}));
var TypePresence;
(function (TypePresence) {
    TypePresence[TypePresence["Aucune"] = 0] = "Aucune";
    TypePresence[TypePresence["Client"] = 1] = "Client";
    TypePresence[TypePresence["Contacts"] = 2] = "Contacts";
    TypePresence[TypePresence["Autre"] = 3] = "Autre";
})(TypePresence = exports.TypePresence || (exports.TypePresence = {}));
var DepotBonIntervention;
(function (DepotBonIntervention) {
    DepotBonIntervention[DepotBonIntervention["BoiteAuxLettres"] = 0] = "BoiteAuxLettres";
    DepotBonIntervention[DepotBonIntervention["PC"] = 1] = "PC";
    DepotBonIntervention[DepotBonIntervention["Garage"] = 2] = "Garage";
    DepotBonIntervention[DepotBonIntervention["Autre"] = 3] = "Autre";
})(DepotBonIntervention = exports.DepotBonIntervention || (exports.DepotBonIntervention = {}));
var TypeSite;
(function (TypeSite) {
    TypeSite[TypeSite["Pavillon"] = 0] = "Pavillon";
    TypeSite[TypeSite["Collectif_Immeuble"] = 1] = "Collectif_Immeuble";
    TypeSite[TypeSite["Commerce_Pro"] = 2] = "Commerce_Pro";
})(TypeSite = exports.TypeSite || (exports.TypeSite = {}));
var CircuitVerification;
(function (CircuitVerification) {
    CircuitVerification[CircuitVerification["Interieur_Site"] = 0] = "Interieur_Site";
    CircuitVerification[CircuitVerification["Interieur_Enceinte"] = 1] = "Interieur_Enceinte";
    CircuitVerification[CircuitVerification["Exterieur_Site"] = 2] = "Exterieur_Site";
    CircuitVerification[CircuitVerification["Verification_KO"] = 3] = "Verification_KO";
})(CircuitVerification = exports.CircuitVerification || (exports.CircuitVerification = {}));
//# sourceMappingURL=enums.js.map
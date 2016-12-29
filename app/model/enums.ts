/**
 * Created by abreneli on 09/08/2016.
 */

export enum Etat {
    Creee,
    Transmise,
    Acceptee,
    Dispatchee,
    Affectee,
    Rejetee,
    Programmee,
    ASL,
    Traitee,
    Statique,
    Annulee,
    Close
}

export enum OrigineFiche {
    AppelTelephonique,
    Essai,
    TraitementAlarme
}

export enum TypeFiche {
    Intervention,
    Gardiennage,
    Ronde,
    GardiennageALaDemande
}

export enum MotifIntervention {
    Intrusion,
    Identification,
    AbsenceTest,
    Autre
}

export enum Trajet {
    Normal,
    Circulation,
    Intemperies,
    Autre
}

export enum TypePresence {
    Aucune,
    Client,
    Contacts,
    Autre
}

export enum DepotBonIntervention {
    BoiteAuxLettre,
    PC,
    Garage,
    Autre
}

export enum TypeSite
{
    Pavillon,
    CollectifImmeuble,
    CommercePro
}

export enum CircuitVerification
{
    InterieurSite,
    InterieurEnceinte,
    ExterieurSite,
    VerificationKO
}

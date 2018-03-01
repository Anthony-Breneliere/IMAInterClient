/**
 * Created by abreneli on 09/08/2016.
 */

export enum Etat {

    Creee,
    EnAppel,
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
    Close,
    AnnulTS,
    AnnulITV,
    NotAllowed
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
    TestReseau,
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
    BoiteAuxLettres,
    PC,
    Garage,
    Autre,
    AEPIA
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

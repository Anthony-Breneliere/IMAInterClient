/**
 * Created by abreneli on 09/08/2016.
 */

export enum OrigineFiche {
    AppelTelephonique = 1,
    Essai,
    TraitementAlarme
}

export enum TypeFiche {
    Intervention = 1,
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
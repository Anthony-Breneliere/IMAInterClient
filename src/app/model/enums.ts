/**
 * Created by abreneli on 09/08/2016.
 */

/*
Il faut s'assurer que la valeur de l'état correspond à la valeur reàue par le serveur.
Sinon l'état affiché ne correspond pas à l'état réel.
 */
export enum Etat {
    Creee = 0,
    EnAppel,
    Transmise,
    Acceptee,
    Dispatchee,
    Affectee,
    Rejetee,
    Programmee,
    ASL,
    CompteRendu,
    Traitee,
    Statique,
    DemandeDepart,
    DepartAutorise,
    Annulee,
    AttenteCloture,
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
    GardiennageALaDemande,
    RondeALaDemande
}

export enum MotifIntervention {
    Intrusion,
    Agression,
    Incendie,
    Technique
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

export enum AppelPourCR
{
    AppelParAPS,
    AppelParSCT
}

export enum OrigineConstatee
{
    ErreurDeManipulation,
    AbsenceIdentification,
    RienASignaler
}

export enum AutoMC
{
    AnnulationIntervention = 1435,
    AnnulationAcceptee = 1480,
    ArriveeSurPlaceIntervenants = 1433,
    ClotureIntervention = 1432,
    RapportIntervention = 1438,
    CompteRenduIntervention = 1482,
    DemandeAnnulationTransmise = 1446,
    DemandeInterventionTransmise = 1444,
    InterventionAcceptee = 1448,
    InterventionRefusee = 1449,
    ReceptionAudio = 6122,
    ReceptionImage = 6120,
    ReceptionVideo = 6121,
    MiseEnStatique = 10380696
}
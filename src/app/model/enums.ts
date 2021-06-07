/**
 * Created by abreneli on 09/08/2016.
 */

/*
Il faut s'assurer que la valeur de l'état correspond à la valeur reàue par le serveur.
Sinon l'état affiché ne correspond pas à l'état réel.
 */
export enum Etat {
    Creee = 0,
    Transmise,
    EnCours,
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
    TestReseau,
    GardiennageALaDemande,
    RondeALaDemande
}

export enum MotifIntervention {
    Intrusion,
    Agression,
    Incendie,
    Technique,
    GardiennageRonde
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
    RienASignaler,
    IncidentReel
}

export enum VerificationSysteme
{
    Sirene,
    SystemeEnService,
    RemiseEnService
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

export enum RapportValidationStatusEnum
{
    Unknown,
    Valid,
    Invalid
}

export enum MainCouranteTypes
{
    CreationIntervention = "Création intervention",
    TransmissionIntervention = "Transmission intervention",
    ClotureIntervention = "Cloture intervention",
    AnnulationIntervention = "Annulation intervention",
    DepartIntervenant = "Départ intervenant",
    ArriveeSurSite = "Arrivée sur site",
    ModificationHeureArrivee = "Modification d'heure d'arrivée",
    ModificationHeureDepart = "Modification d'heure de départ",
    ModificationHeureLancement = "Modification d'heure de lancement",
    CommentaireIntervention = "Commentaire intervention",
    FaxDemandeIntervention = "Fax demande d'intervention",
    RapportIntervention = "Rapport d'intervention",
    ConstatIntervention = "Constat d'intervention",
    ContreAppel = "Contre appel",
    ConditionsDeCirculation = "Conditions de circulation",
    Facturation = "Facturation",
    CallBackAps = "call back aps",
    CallBack = "call back",
    DemandeInterventionAuPDA = "Demande d'intervention au PDA",
    DemandeInterventionForceeAuPDA = "Demande d'intervention forcée au PDA",
    DemandeInterventionerreur = "Demande d'intervention en erreur",
    DemandeAnnulationAuPDA = "Demande d'annulation au PDA",
    DemandeAnnulationForceeAuPDA = "Demande d'annulation forcée au PDA",
    DemandeAnnulationErreur = "Demande d'annulation en erreur",
    ReceptionEtatMissionPDA = "Réception de l'état de mission du PDA",
    ReceptionCompteRenduPDA = "Réception du compte-rendu du PDA",
    DelaiInterventionPDADepasse = "Délai d'intervention PDA dépassé",
    DelaiAnnulationPDADepasse = "Délai d'annulation PDA dépassé",
    DemandeInterventionTransmise = "Demande d'intervention transmise",
    DemandeInterventionNonTransmise = "Demande d'intervention non transmise",
    DemandeAnnulationTransmise = "Demande d'annulation transmise",
    DemandeAnnulationNonTransmise = "Demande d'annulation non transmise",
    InterventionAccepteeParPDA = "Intervention acceptée par le PDA",
    InterventionRefuseeParPDA = "Intervention refusée par le PDA",
    AnnulationAccepteeParPDA = "Annulation acceptée par le PDA",
    AnnulationRefuseeParPDA = "Annulation refusée par le PDA",
    InterventionAcceptee = "Intervention acceptée",
    InterventionRefusee = "Intervention refusée",
    AnnulationAcceptee = "Annulation acceptée",
    AnnulationRefusee = "Annulation refusée",
    CompteRenduIntervention = "Compte-rendu d'intervention",
    MailDemandeIntervention = "Mail demande d'intervention",
    ReceptionImage = "Réception d'une image",
    ReceptionAudio = "Réception d'une audio",
    ReceptionVideo = "Réception d'une vidéo",
    DemandeMiseEnPlaceADS = "Demande de mise en place ADS",
    InformationIntervention = "Information intervention",
    DemandeAnnulationAutomatique = "Demande d'annulation automatique",
    ConfirmationAlarmeTransmiseAuPDA = "Confirmation d'alarme transmise au PDA",
    ConfirmationAlarmeNonTransmiseAuPDA = "Confirmation alarme non transmise au PDA",
    ConfirmationAlarmeTransmise = "Confirmation d'alarme transmise",
    ConfirmationAlarmeNonTransmise = "Confirmation d'alarme non transmise",
    TransfertInterventionEntrePDA = "Transfert d'intervention entre PDA",
    MiseEnStatiqueIntervenant = "Mise en statique intervenant"
}

export enum OrigineAnnulation
{
    ClientAccepteParIntervenant,
    ClientNonAccepteParIntervenant,
    Intervenant,
    Station
}
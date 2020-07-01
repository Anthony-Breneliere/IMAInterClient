import { Intervention } from '../model/intervention';
import { Site } from '../model/site';
import { Alarme } from '../model/alarme';
import { Rapport } from '../model/rapport';
import { Telephone } from '../model/telephone';
import { InterventionState } from '../model/intervention_state';
import { OrigineFiche, TypeFiche, MotifIntervention, Trajet, TypePresence, DepotBonIntervention, Etat } from '../model/enums';
import { ITypeMainCourante } from "../model/type_maincour";

import { Injectable } from '@angular/core';
/*

@Injectable()
export class InterventionFactory  {

    public CreateBasicIntervention( operatorName: string ) : any
    {
        let newIntervention  = {
            IdM1: 0,
            Etat: Etat.Creee,
            Origine: OrigineFiche.TraitementAlarme,
            TypeFiche: TypeFiche.Intervention,
            Creation: new Date(),
            MomentAppel: new Date(),
            DateArrivee: null,
            DateAnnulation: null,
            DateDepart: null,
            Lancement: null,
            Cloture: null,
            Site: this.CreateBasicSite(),
            Alarme: new Alarme(),
            FicheQualite: null,
            Intervenant: {
                Societe: "0123456789",
                Nom: "Générique intervenant",
                Telephones : []
            },
            Rapport:
            {
                ArriveeSurLieux :
                {
                    NonAccesAuSite : {}
                },
                Verifications :
                {
                    QuellesLumieresAllumees : {},
                    QuellesIssuesOuvertes : {},
                    QuellesEffractions : {},
                },
                MiseEnSecurite : {},
                Presence : {},
                Trajet : {
                    RapportMeteo : {}
                }
            },
            MainCourantes: [],
            Chat: [],
            InfosFacturation: null,
            NotificationChange: false,

            Operateur: operatorName

        };

        return newIntervention;
    }


    public CreateBasicSite() : Site
    {
        var newSite : Site = {
            Id : 0,
            Contrat : "20160781001",
            Nom: "Breneliere",
            Prenom: "Anthony",
            Qualite : "M.",
            NumeroRue : "11",
            Adresse : "rue des Frênes",
            CodePostal : "44119",
            Ville: "Treillieres",
            Telephones : new Array<Telephone>(),
            Informations: "Apporter son VISA",
            Latitude: 0,
            Longitude: 0
        }

        return newSite;
    }

}
*/

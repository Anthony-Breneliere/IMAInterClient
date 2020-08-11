
/**
 * Created by abreneli on 04/07/2016.
 */

import {Component, ViewChild, OnInit, AfterContentInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';
import {InterventionGroup, GroupTypeEnum} from '../groupe/intervention.group';
import {Intervention} from "../../model/intervention";
import {Etat} from "../../model/enums";
import {InterventionButton} from "../button/intervention.button";
import {InterventionService} from "../../services/intervention.service";
import {ConnectionStatus} from "../../services/connection.status";
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Chat } from '../chat/chat';
import {Subscription} from 'rxjs';

import 'rxjs-compat/add/operator/switchMap';
import { SearchQuery } from 'app/services/searchQuery';



@Component({
    moduleId: module.id,
    selector: 'intervention-main-display',
    templateUrl: './intervention.main_display.html',
    styleUrls:  ['./intervention.main_display.css'],
})

export class InterventionMainDisplay implements OnInit, AfterContentInit {

    public GroupTypeEnum = GroupTypeEnum; // <- using enum in html

    // ce composant là il SAIT quel bouton est toujours sélectionné (il ne peut y en avoir qu'un)
    private selectedButton : InterventionButton;

    public afficheNavigation : boolean;
    public afficheBarre : boolean = true;

    private paramsSubscription : Subscription;
    private queryParamsSubscription : Subscription;

    @ViewChild("myGroup" ) myGroup : InterventionGroup;
    @ViewChild("othersGroup" ) othersGroup : InterventionGroup;
    @ViewChild("searchGroup" ) searchGroup : InterventionGroup;

    constructor(
        private connectionStatus: ConnectionStatus,
        private _interService: InterventionService,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone
    )
    {}

    public flapNav()
    {
        this.afficheNavigation = ! this.afficheNavigation;

        this.router.navigate( [], { queryParams:
            {
                nav: this.afficheNavigation ? 1 : 0,
                bar: this.afficheBarre ? 1 : 0
            } } );
    }

    ngOnDestroy() {
        this.paramsSubscription?.unsubscribe();
        this.queryParamsSubscription?.unsubscribe();
    }

    ngOnInit() {

      console.log("Initilisation du composant InterventionMainDisplay");

      this.route.url.subscribe( url =>
      {
        try
        {
          if ( ! url || url.length <= 0)
            return;

          switch( url[0].path )
          {
            // en cas de search dans l'url alors on déploie tous les groupes

            case "search":

              setTimeout( () => {
                if ( this.myGroup )
                  this.myGroup.Expanded = true;
                if ( this.othersGroup )
                  this.othersGroup.Expanded = true;
                if ( this.searchGroup )
                  this.searchGroup.Expanded = true;
              }, 20 );

              break;

            // en cas d'intervention dans l'url alors on charge l'intervention et on déploie le groupe qui la contient

            case "intervention":

              if ( url.length <= 1)
                return;

              let id : string = url[1].path;

              if (id)
              {
                let urlInterventionId = url[1].path;

                // la zone permet d'avoir l'exécution des callback géré par Angular
                // en l'occureence quand l'utilisateur change l'id de l'intervention
                // dans l'URL
                // plus d'info sur les zones https://angular.io/guide/zone
                this.ngZone.run(() => {
                  // une fois la connection établie et l'intervention id complète reçu du serveur, alors
                  // on sélectionne et affiche l'intervention
                  this._interService.connectAndLoadIntervention(urlInterventionId).then((inter : Intervention) =>
                  {
                    if (this.selectedIntervention !== inter)
                    {
                      this.selectedIntervention = inter;
                      this.deployGroup(this.selectedIntervention);
                    }
                  })
                  .catch((reason : any) => {
                    console.error( "Erreur de chargement de l'intervention: ", reason );
                  });

                });
              }

          }
        }
        catch(reason)
        {
          // Toujours catcher les erreurs événements sinon la souscription est automatiquement rompue en cas
          // d'erreur
          console.error("Erreur lors de la détection d'un changement d'url", reason);
        }
      });


      this.queryParamsSubscription = this.route.queryParams.subscribe( queryParams =>
      {
        try {

          this.afficheNavigation = queryParams['nav'] != 0;
          this.afficheBarre = queryParams['bar'] != 0;


          if ( this.afficheNavigation  )
          {
            // ouverture du groupe ayant une intervention sélectionnée
            setTimeout( () => {
              this.deployGroup( this.selectedIntervention );
            }, 50);

          }

        }
        catch( reason ) {
          console.error( "Erreur de changement de paramètres dans l'url", reason );
        }


      } );


    }



    get chatDisplayed() : boolean
    {
        return false; // désactivée sans client mobile

        // let inter = this.selectedIntervention;

        // let interLancee : boolean =
        //     inter && inter.Etat != Etat.Creee;

        // let messages : boolean =
        //     inter && inter.Chat && inter.Chat.length > 0;

        // let chatDisplayed : boolean = interLancee || messages;

        // return chatDisplayed;
    }

    get isThereIntervenant() : boolean
    {
        let inter = this.selectedIntervention;
        let isThereIntervenant : boolean =
            inter &&  inter.Etat != Etat.Creee
            && inter.Etat != Etat.Annulee
            && inter.Etat != Etat.Close;
        return isThereIntervenant;
    }

    ngAfterContentInit()
    {
        // code exécuté après l'initialisation des vues @ViewChild
        if ( this.afficheNavigation  )
            this.deployGroup( this.selectedIntervention );
    }


    private _selectedIntervention : Intervention;
    get selectedIntervention() : Intervention
    {
        // si on a un bouton qui est sélectionné alors on prend l'intervention du bouton
        return this._selectedIntervention;
    }

    set selectedIntervention( value: Intervention)
    {
        this._selectedIntervention = value;
    }

    /**
     * Le groupe de l'intervention doit toujours être sélectionné
     */
    private deployGroup( inter: Intervention )
    {
      let groupToExpand : InterventionGroup = null;

      if ( inter && this.myGroup && this.othersGroup && inter.Etat != Etat.Close && inter.Etat != Etat.Annulee )
      {
          if ( this.connectionStatus.operatorNameEqual( inter.Operateur ) )
              groupToExpand = this.myGroup;
          else
              groupToExpand = this.othersGroup;
      }
      else if ( this.searchGroup )
      {
          groupToExpand = this.searchGroup;
      }

      // deploiement du groupe
      if ( groupToExpand )
          groupToExpand.Expanded = true;
    }

    onSelectedButton(newSelectedButton: InterventionButton)
    {
        if (  this.selectedButton != newSelectedButton)
        {
            this.selectedButton = newSelectedButton;
            this.selectedIntervention = newSelectedButton.intervention;

        }
        else
        {
          // on désélectionne le bouton et l'intervention
          this.selectedButton = null;
          this.selectedIntervention = null;
        }

    }


}

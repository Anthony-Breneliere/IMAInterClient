import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { SearchQuery } from "app/services/searchQuery";
import { InterventionService } from "app/services/intervention.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'search-intervention',
  templateUrl: './search.html',
  styleUrls:  ['./search.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class SearchIntervention
{
  @Output() searchStatus = new EventEmitter<string>();

  @Input() public pageIndex: number;

  Search: SearchQuery = new SearchQuery();

  private paramsSubscription : Subscription;
  private currentQuery : any = null;

  constructor(
    private _interService : InterventionService,
    private route: ActivatedRoute )
  {
  }

  ngOnChanges(changes) {
    if(this.pageIndex > 1)
    {
      this.searchInterventions();
    }
    // TODO GMA
  }

  ngOnInit()
  {
    this.route.url.subscribe( url => {

      try {

        if ( ! url || url.length == 0 )
          return;

        if ( url[0].path == 'search')
        {
          this.paramsSubscription = this.route.queryParams.subscribe( params =>
            {
              let contrat : string = params['contrat'] ?? '';
              let debut : string = params['dateDebut'] ?? '';
              let fin : string = params['dateFin'] ?? '';
              let type : string = params['typeIntervention'] ?? '';

              this.Search =
              {
                FreeQuery: contrat,
                StartDate: debut ? new Date( debut ) : null,
                EndDate: debut ? new Date( fin ) : null,
                TypeIntervention:  type
              }

              this.searchInterventions();
            } );
        }
      }
      catch( reason )
      {
        console.error("Le composant recherche n'a pu initaliser l'url de la barre d'adresse", reason );
      }


    });

  }

  get dateNow() : Date { return new Date() };


  get maxDateRequired() : Date
  {
    let dateNow = this.dateNow;
    return (this.Search.EndDate ?? dateNow < dateNow ? this.Search.EndDate : dateNow );
  }

  // TODO GMA réagir a un evenement envoyer par le scroll

  // TODO GMA add pageIndex
  searchInterventions()
  {
    let query = this.Search;

    // on recherche les interventions à partir de 4 caractères saisis
    if ( query )
    {
      var acceptableQuery = (query.FreeQuery && query.FreeQuery.length) > 3
        || query.StartDate != null
        || query.TypeIntervention;

      if( acceptableQuery )
      {
        if(this.currentQuery === null)
        {
          this.currentQuery = acceptableQuery;
        }
         
        if(this.pageIndex == 1 || this.currentQuery != acceptableQuery)
        {
          this.pageIndex = 1;
          this.currentQuery = acceptableQuery;
          this.searchStatus.emit( 'start' );
        }  

        this._interService.searchInterventions( this.Search, this.pageIndex )
        .then( () => {
          this.searchStatus.emit( 'stop' );
        })
        .catch( reason => {
          console.log( "La recherche d'interventions a échoué ", reason, this.Search );
          this.searchStatus.emit( 'stop' );
        });
      }
    }

  }
}

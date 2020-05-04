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

  Search: SearchQuery = new SearchQuery();

  private paramsSubscription : Subscription;

  constructor(
    private _interService : InterventionService,
    private route: ActivatedRoute )
  {
  }

  ngOnInit()
  {
    this.route.url.subscribe( url => {

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
              StartDate: new Date( debut ),
              EndDate: new Date( fin ),
              TypeIntervention:  type
            }

            this.searchInterventions();
          } );
      }

    });

  }

  get dateNow() : Date { return new Date() };


  get maxDateRequired() : Date
  {
    let dateNow = this.dateNow;
    return (this.Search.EndDate ?? dateNow < dateNow ? this.Search.EndDate : dateNow );
  }

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
        this.searchStatus.emit( 'start' );

        this._interService.searchInterventions( this.Search )
        .then( () => {
          this.searchStatus.emit( 'stop' );
        })
        .catch( reason => {
          console.log( "La recherche d'interventions a échoué " + reason + ":" );
          console.log( this.Search );
          this.searchStatus.emit( 'stop' );
        });
      }
    }

  }
}

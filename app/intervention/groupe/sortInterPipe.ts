/**
 * Created by abreneli on 05/04/2017.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Intervention } from '../../model/intervention';

/**
 * Tri des intervention sur la date de création de l'intervention, en ordre décroissant.
 */
@Pipe( {
  name: 'sortInterventionByDateTime',
  pure: true // le passage à false fait ramer énormément l'appli, mais permettait de garder la liste constemment triée
    // l'astuce pour garder le pipe pure a été d'ajouter en paramètre le dernier DTO dont la date a changé. Ainsi, si on change 
    // ce dto dans le composant d'historique, alors cela déclenche une réévaluation du pipe.
} )
export class SortInterventionByDateTime implements PipeTransform
{
      
  transform( interList : Intervention[] ): Intervention[]
  {
      let sortedList = interList.sort( ( inter1, inter2 ) =>
      {
        if ( inter1.Creation < inter2.Creation )
          return 1;

        if ( inter1.Creation > inter2.Creation )
          return -1;

        return 0;
      });

      return sortedList;
  }
}
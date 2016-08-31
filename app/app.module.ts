/**
 * Created by abreneli on 10/08/2016.
 *
 * Le module permet d'ajouter autant de composants, directives et services souhaités qui seront reconnus par
 * la grappe de composants InterventionAppComponent. Cela permet de ne pas à importer chaque composant/directive
 * importé individuellement au niveau de chaque composant de InterventionAppComponent
 */

import { HttpModule } from '@angular/http';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { InterventionAppComponent }  from './app.component';
import { InterventionService } from './intervention/intervention.service';
import { ApplicationService } from './application.service';
import { appRoutes } from './routes';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        HttpModule ],

    /*
       Déclaration des composants et des directives utilisées par le module. En les ajoutant ici
       on les rend disponibles pour chaque composant du module sans avoir à les déclarer en tant
       que directive du composant.
     */
    declarations: [ InterventionAppComponent ],

    /*
       Liste des services utilisés par le module. Les services sont injectés dans les composants.
       Pour qu'un composant du module puisse utilise le service, il faut que celui soit ajouté
       en paramètre du constructeur. Une seule instance est créée pour chaque service.
     */
    providers:    [ ApplicationService, InterventionService ],

    /*
     * Composant affiché par le module.
     */
    bootstrap:    [ InterventionAppComponent ]
})
export class AppModule {}
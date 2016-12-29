/**
 * Created by abreneli on 10/08/2016.
 *
 * Le module permet d'ajouter autant de composants, directives et services souhaités qui seront reconnus par
 * la grappe de composants InterventionAppComponent. Cela permet de ne pas à importer chaque composant/directive
 * importé individuellement au niveau de chaque composant de InterventionAppComponent
 */

/* Liste des modules */
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';

/* Liste des composants */
import { InterventionAppComponent }  from './app.component';
import { InterventionService } from './services/intervention.service';
import { appRoutes } from './routes';
import { InputTextbox } from './tools/input/input_textbox';
import { Checkbox } from './tools/checkbox/checkbox';
import { Section } from './intervention/section/section';
import { InterventionGroup } from './intervention/groupe/intervention.group';
import { InterventionDetails } from './intervention/details/intervention.details';
import { InterventionButton } from './intervention/button/intervention.button';
import { AppBar } from './app_bar/app_bar';
import { InterventionMainDisplay } from './intervention/main_display/intervention.main_display';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        HttpModule, 
        RouterModule.forRoot (appRoutes) ],

    /*
       Déclaration des composants et des directives utilisées par le module. En les ajoutant ici
       on les rend disponibles pour chaque composant du module sans avoir à les déclarer en tant
       que directive du composant.
     */
    declarations: [ 
        InterventionAppComponent,
        InterventionMainDisplay,
        InputTextbox,
        Section,
        Checkbox,
        InterventionGroup,
        InterventionDetails,
        InterventionButton,
        AppBar ],

    /*
       Liste des services utilisés par le module. Les services sont injectés dans les composants.
       Pour qu'un composant du module puisse utilise le service, il faut que celui soit ajouté
       en paramètre du constructeur. Une seule instance est créée pour chaque service.
     */
    providers:    [ InterventionService,  {provide: LocationStrategy, useClass: HashLocationStrategy }],

    /*
     * Composant affiché par le module.
     */
    bootstrap:    [ InterventionAppComponent ],

    /* Permet d'utiliser dans le module des composants qui sont pas Angular, comme les composants Polymer
     */ 
    schemas:    [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
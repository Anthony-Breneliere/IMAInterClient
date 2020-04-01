/**
 * Created by abreneli on 10/08/2016.
 *
 * Le module permet d'ajouter autant de composants, directives et services souhaités qui seront reconnus par
 * la grappe de composants InterventionAppComponent. Cela permet de ne pas à importer chaque composant/directive
 * importé individuellement au niveau de chaque composant de InterventionAppComponent
 */

/* Liste des modules */
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';

/* Liste des services */
import { InterventionService } from './services/intervention.service';
import { ConnectionStatus } from './services/connection.status';
import { ContextMenuModule } from 'ngx-contextmenu';

/* Liste des composants */
import { InterventionAppComponent }  from './app.component';
import { appRoutes } from './routes';
import { InputTextbox } from './tools/input/input_textbox';
import { Checkbox } from './tools/checkbox/checkbox';
import { Section } from './intervention/section/section';
import { Field } from './intervention/section/field';
import { InterventionGroup } from './intervention/groupe/intervention.group';
import { InterventionDetails } from './intervention/details/intervention.details';
import { InterventionButton } from './intervention/button/intervention.button';
import { InterventionButtonContent } from './intervention/button/intervention.button.content';
import { AppBar } from './app_bar/app_bar';
import { InterventionMainDisplay } from './intervention/main_display/intervention.main_display';
import { Location, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { DraggableDirective } from './tools/draggable';
import { SortInterventionByDateTime } from './intervention/groupe/sortInterPipe';
import { Chat } from './intervention/chat/chat';
import { Maincourantes } from './intervention/maincourantes/maincourantes';
import { DateInputComponent } from './tools/input/date-input.component';



// import { ReactiveBaseComponent } from './intervention/reactive-components/reactive-base';
import { ReactiveInputComponent } from './intervention/reactive-components/reactive-input.component';
import { ReactiveCheckboxComponent } from './intervention/reactive-components/reactive-checkbox.component';
import { ReactiveSelectComponent } from './intervention/reactive-components/reactive-select.component';
import { ReactiveTextareaComponent } from './intervention/reactive-components/reactive-textarea.component';
import { ReactiveDateInputComponent } from './intervention/reactive-components/reactive-date.input.component';

import { TestComponent } from './test/test.component';

// inclus pour le datepicker:

@NgModule({
    imports:      [
        BrowserModule,
        BrowserAnimationsModule,
        ContextMenuModule.forRoot(),
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot (appRoutes),
        DlDateTimePickerDateModule,
      ],
    /*
       Déclaration des composants et des directives utilisées par le module. En les ajoutant ici
       on les rend disponibles pour chaque composant du module sans avoir à les déclarer en tant
       que directive du composant.
     */
    declarations: [
        InterventionAppComponent,
        InterventionMainDisplay,
        InputTextbox,
        Field,
        Section,
        Checkbox,
        DateInputComponent,
        InterventionGroup,
        InterventionDetails,
        InterventionButton, InterventionButtonContent,
        DraggableDirective,
        SortInterventionByDateTime,
        AppBar,
        Chat,
        Maincourantes,
        ReactiveTextareaComponent,
        ReactiveInputComponent,
        ReactiveSelectComponent,
        ReactiveCheckboxComponent,
        ReactiveDateInputComponent,
        TestComponent,
        ],

    /*
       Liste des services utilisés par le module. Les services sont injectés dans les composants.
       Pour qu'un composant du module puisse utilise le service, il faut que celui soit ajouté
       en paramètre du constructeur. Une seule instance est créée pour chaque service.
     */
    providers:    [
        { provide: LOCALE_ID, useValue: 'fr' },
        ConnectionStatus,
        InterventionService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }],

    /*
     * Composant de démarrage affiché par le module.
     */
    bootstrap:    [ InterventionAppComponent ],

    /* Permet d'utiliser dans le module des composants qui sont pas Angular, comme les composants Polymer
     */
    schemas:    [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}

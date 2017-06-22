/**
 * Created by abreneli on 10/08/2016.
 *
 * Le module permet d'ajouter autant de composants, directives et services souhaités qui seront reconnus par
 * la grappe de composants InterventionAppComponent. Cela permet de ne pas à importer chaque composant/directive
 * importé individuellement au niveau de chaque composant de InterventionAppComponent
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Liste des modules */
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var angular2_contextmenu_1 = require("angular2-contextmenu");
/* Liste des composants */
var app_component_1 = require("./app.component");
var intervention_service_1 = require("./services/intervention.service");
var routes_1 = require("./routes");
var input_textbox_1 = require("./tools/input/input_textbox");
var checkbox_1 = require("./tools/checkbox/checkbox");
var section_1 = require("./intervention/section/section");
var field_1 = require("./intervention/section/field");
var intervention_group_1 = require("./intervention/groupe/intervention.group");
var intervention_details_1 = require("./intervention/details/intervention.details");
var intervention_button_1 = require("./intervention/button/intervention.button");
var app_bar_1 = require("./app_bar/app_bar");
var intervention_main_display_1 = require("./intervention/main_display/intervention.main_display");
var common_1 = require("@angular/common");
var draggable_1 = require("./tools/draggable");
var sortInterPipe_1 = require("./intervention/groupe/sortInterPipe");
var chat_1 = require("./intervention/chat/chat");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            angular2_contextmenu_1.ContextMenuModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            router_1.RouterModule.forRoot(routes_1.appRoutes)
        ],
        /*
           Déclaration des composants et des directives utilisées par le module. En les ajoutant ici
           on les rend disponibles pour chaque composant du module sans avoir à les déclarer en tant
           que directive du composant.
         */
        declarations: [
            app_component_1.InterventionAppComponent,
            intervention_main_display_1.InterventionMainDisplay,
            input_textbox_1.InputTextbox,
            field_1.Field,
            section_1.Section,
            checkbox_1.Checkbox,
            intervention_group_1.InterventionGroup,
            intervention_details_1.InterventionDetails,
            intervention_button_1.InterventionButton,
            draggable_1.DraggableDirective,
            sortInterPipe_1.SortInterventionByDateTime,
            app_bar_1.AppBar,
            chat_1.Chat
        ],
        /*
           Liste des services utilisés par le module. Les services sont injectés dans les composants.
           Pour qu'un composant du module puisse utilise le service, il faut que celui soit ajouté
           en paramètre du constructeur. Une seule instance est créée pour chaque service.
         */
        providers: [intervention_service_1.InterventionService, { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }],
        /*
         * Composant affiché par le module.
         */
        bootstrap: [app_component_1.InterventionAppComponent],
        /* Permet d'utiliser dans le module des composants qui sont pas Angular, comme les composants Polymer
         */
        schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
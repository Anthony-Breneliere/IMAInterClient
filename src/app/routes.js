"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var intervention_main_display_1 = require("./intervention/main_display/intervention.main_display");
exports.appRoutes = [
    {
        path: 'intervention/:id',
        component: intervention_main_display_1.InterventionMainDisplay
    },
    {
        path: 'intervention',
        component: intervention_main_display_1.InterventionMainDisplay
    },
    {
        path: '',
        component: intervention_main_display_1.InterventionMainDisplay
    },
    {
        path: 'aot',
        redirectTo: '/aot'
    }
];
exports.routing = router_1.RouterModule.forRoot(exports.appRoutes);
//# sourceMappingURL=routes.js.map
/**
 * Created by abreneli on 04/07/2016.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { InterventionAppComponent } from './app.component';
import { InterventionMainDisplay } from './intervention/main_display/intervention.main_display';

export const appRoutes: Routes = [
    {
        path: 'intervention/:id',
        component: InterventionMainDisplay
            // <router-outlet></router-outlet>
            /*
        path: '',
        component: InterventionAppComponent,
        children: [ 
        {
            path: ':id',
            component: InterventionMainDisplay
        },
        {
            path: '',
            component: InterventionMainDisplay
        }]*/
    },
    {
        path: 'intervention',
        component: InterventionMainDisplay
    },
    {
        path: '',
        component: InterventionMainDisplay
    },
    {
        path: 'aot',
        redirectTo: '/aot'
    }


];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

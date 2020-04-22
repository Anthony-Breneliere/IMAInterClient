/**
 * Created by abreneli on 04/07/2016.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { InterventionAppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { InterventionMainDisplay } from './intervention/main_display/intervention.main_display';

export const appRoutes: Routes = [
    {
        path: 'intervention/:id',
        component: InterventionMainDisplay
    },
    {
      path: 'search',
      component: InterventionMainDisplay
    },
    {
        path: 'test',
        component: TestComponent
    },
    {
        path: '',
        pathMatch: 'prefix', //default
        redirectTo : 'intervention/0'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

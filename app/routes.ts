/**
 * Created by abreneli on 04/07/2016.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { InterventionAppComponent } from './app.component';

export const appRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: '/dashboard',
    //     pathMatch: 'full'
    // },
    {
        path: 'dashboard',
        component: InterventionAppComponent
    },
    {
        path: 'interapp/:id',
        component: InterventionAppComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

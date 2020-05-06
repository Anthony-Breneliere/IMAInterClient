/**
 * Created by abreneli on 04/07/2016.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, UrlSegment }  from '@angular/router';
import { InterventionMainDisplay } from './intervention/main_display/intervention.main_display';

export const appRoutes: Routes = [
    {
        // il est important de faire apparaître InterventionMainDisplay une seule fois
        // dans la configuration pour ne pas avoir à détruire InterventionMainDisplay
        // en casde changement de route.
        path: '**',
        component: InterventionMainDisplay
    },
    {
        path: '',
        pathMatch: 'prefix', //default
        redirectTo : 'intervention/0'
    }
];

export function matcherFunction(url: UrlSegment[])
{
    const path = url[0].path;

    if( path.startsWith('intervention')
      || path.startsWith('search') )
    {
      return {consumed: url};
    }
  return null;
}

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

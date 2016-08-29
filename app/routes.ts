/**
 * Created by abreneli on 04/07/2016.
 */
import { provideRouter, RouterConfig }  from '@angular/router';

import { InterventionAppComponent } from './app.component';

export const routes: RouterConfig = [
    {
        path: 'interapp',
        component: InterventionAppComponent
    },
    {
        path: 'interapp/:id',
        component: InterventionAppComponent
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
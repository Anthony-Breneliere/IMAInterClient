/**
 * Created by abreneli on 10/08/2016.
 */

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { InterventionAppComponent }  from './app.component';
import { InterventionService } from './intervention/intervention.service';
import { ApplicationService } from './application.service';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule ],
    declarations: [ InterventionAppComponent ],
    providers:    [ ApplicationService, InterventionService ],
    bootstrap:    [ InterventionAppComponent ]
})
export class AppModule {}
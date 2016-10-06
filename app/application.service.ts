/**
 * Created by abreneli on 04/07/2016.
 */
import { Injectable }    from '@angular/core';
// import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApplicationService {

    private interventionsAppUrl = 'app/interventions';  // URL to web api

    public login: string;
    public password: string;
    public m1Connected: boolean = false;
    public plottiConnected: boolean = false;

    // constructor(private http: Http) { }

    public connect( login: string, password: string ) : boolean
    {
        this.login = login;
        this.password = password;

        // vérification de la validité du login / password
        if( this.login && this.login != "" && this.password && this.password != "" )
        {
            // TODO: se connecter au serveur Plotti

            this.m1Connected = true;
            this.plottiConnected = true;

            return true;
        }

        return false;
    }

    public disconnect() : boolean
    {
        this.m1Connected = false;
        this.plottiConnected = false;

        return true;
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
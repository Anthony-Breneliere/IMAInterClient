
import {Component, ViewChild, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Intervention} from "../../model/intervention";
import {Etat} from "../../model/enums";
import {InterventionService} from "../../services/intervention.service";
import { Subject, Subscription } from "rxjs";
import { filter } from "rxjs/operators"

@Component({
    moduleId: module.id,
    selector: 'chat',
    templateUrl: './chat.html',
    styleUrls:  ['./chat.css'],

    // pour des raisons de performance, les champs ne seront mis à jour que sur un appel de onChangeCallback
    changeDetection : ChangeDetectionStrategy.OnPush
})

export class Chat {

    @ViewChild('messageInput') messageInput:ElementRef;

    // liste des changements
    private newInterDataSource = new Subject< Intervention >();

    newInterSub : Subscription;

    // l'intervention affichée est passée en paramètre du composant
    private _intervention: Intervention;

    @Input() public set intervention( value : Intervention )  {
        this._intervention = value;

        // à chaque changement d'intervention affichée le composant s'abonne aux changements de l'intervention correspondante
        if ( this.newInterSub )
            this.newInterSub.unsubscribe();

        // on filtre les message sur l'instance de l'intervention qui est actuellement affichée
        this.newInterSub =
            this.interService.newMessages$
            .pipe( filter( m => m[0] == this._intervention  ) )
            .subscribe( i => { this.ref.detectChanges(); } );
    }

    ngOnDestroy()
    {
        if ( this.newInterSub )
            this.newInterSub.unsubscribe();
    }

    public get intervention()  {  return this._intervention; }

    constructor( private interService: InterventionService, private ref: ChangeDetectorRef )
    {

    }

    writeMessage( $event : any, message : string )
    {
        this.interService.chat( this.intervention.Id, message );
        this.messageInput.nativeElement.value = "";
    }

    keyPress( $event : any )
    {
        if ( $event.keyCode == 13 )
        {
            this.interService.chat( this.intervention.Id, this.messageInput.nativeElement.value );
            this.messageInput.nativeElement.value = "";
        }
    }


    get canChat() : boolean
    {
        let inter = this._intervention;
        let canChat : boolean =
            inter &&  inter.Etat != Etat.Annulee
            && inter.Etat != Etat.Close;
        return canChat;
    }
}

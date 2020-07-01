
import {Component, ViewChild, OnInit, AfterViewInit, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Intervention} from "../../model/intervention";
import {Etat} from "../../model/enums";
import {InterventionButton} from "../button/intervention.button";
import {InterventionService} from "../../services/intervention.service";
import { Subject, Subscription } from "rxjs";
import { ITypeMainCourante } from '../../model/type_maincour';
import { MainCourante } from '../../model/main_courante';
import { filter } from 'rxjs/operators';

@Component({
    moduleId: module.id,
    selector: 'maincourantes',
    templateUrl: './maincourantes.html',
    styleUrls:  ['./maincourantes.css'],

    // pour des raisons de performance, les champs ne seront mis à jour que sur un appel de onChangeCallback
    changeDetection : ChangeDetectionStrategy.OnPush
})

export class Maincourantes {

    @ViewChild('messageInput') messageInput:ElementRef;
    @ViewChild('listMainCourante') listMainCourante:ElementRef;

    // saisie d'une matin courante:
    public selectedMaincourType : ITypeMainCourante;
    public maincourComment : string = "";
    private nbMainCourante : number = 0;

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
            this.interService.newInterData$
            .pipe( filter( i => this.intervention && this.intervention.Id == i.Id ) )
            .subscribe( i => { this.detectChanges(); } );

    }

    ngOnDestroy()
    {
        if ( this.newInterSub )
            this.newInterSub.unsubscribe();
    }

    public get listMainCour() : MainCourante[]
    {
        if ( ! this._intervention || ! Array.isArray( this._intervention.MainCourantes ) )
            return [];

        var displayedMainCour =
            this._intervention.MainCourantes.sort( (m1, m2) => {
                return m1.Date > m2.Date ? 1 :  m1.Date < m2.Date ? -1 : 0;
            });

        return displayedMainCour;
    };


    // this.intervention && this.intervention.MainCourantes ? this.intervention.MainCourantes :
    public get listTypeMainCour() : ITypeMainCourante[]
    {
         return this.interService.listeTypeMaincour.filter( mc => mc != null );
    }

    public get intervention()  {  return this._intervention; }

    constructor( private interService: InterventionService, private ref: ChangeDetectorRef )
    {

    }

    public addNewMaincourante() : void
    {
        if(this._intervention.MainCourantes)
        {
            this.nbMainCourante = this._intervention.MainCourantes.length;
        }    


        if ( ! this.selectedMaincourType)
        {
            // toto animation pour higlighter la sélection du type de main courante
            return;
        }
        else
        {
            this.interService.addNewMaincourante( this._intervention.Id, this.selectedMaincourType, this.maincourComment );
            this.maincourComment = "";
        }        
    }

    public scrollDown(): void
    {      
        this.listMainCourante.nativeElement.scrollTop = this.listMainCourante.nativeElement.scrollHeight; 
    }

    /**
     *
     * @param key Retourne le libelle d'une main courante, connaissant son id
     */
    getTypeMaincourValue( key: string ) : string
    {
        // retourne le libellé du type de main courante ou "inconnu" si le type n'existe pas:
        let foundMainCour =  this.interService.listeTypeMaincour.find( e => e.Id == key )
            || this.interService.listeM1LibelleDivers.find( e => e.Id == key );

        return foundMainCour ? foundMainCour.Libelle : "Type inconnu";
    }

    detectChanges()
    {
        this.ref.detectChanges();
                
        if(this.nbMainCourante != this._intervention.MainCourantes.length)
        {
            this.nbMainCourante = this._intervention.MainCourantes.length;
            this.scrollDown();
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

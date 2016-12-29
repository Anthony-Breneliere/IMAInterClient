
/**
 * Main courante de l'intervention
 */
export class MainCourante
{
    Id: number;
    Type: number;
    Date: Date;
    Commentaire: string;

    constructor( jsonData : Object )
    {
        $.extend( this, jsonData);
    }
}
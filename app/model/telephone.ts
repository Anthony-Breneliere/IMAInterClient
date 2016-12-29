/**
 * Classe téléphone
 */
export class Telephone
{
    Type: string;
    Numero: string;

    constructor( jsonData : Object )
    {
        $.extend( this, jsonData);
    }
}
import { AppelPourCR, OrigineConstatee } from './enums'

export class InfosFacturation
{
    Id: string; // Guid
    AppelPourCR : AppelPourCR;
    OrigineConstatee : OrigineConstatee;
    BloqueAuPortail : boolean;
}

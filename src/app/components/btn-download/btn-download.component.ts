import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'btnDownload',
  templateUrl: './btn-download.component.html',
  styleUrl: './btn-download.component.css'
})
export class BtnDownloadComponent {
  @Input() nomeArquivo: string='';
  @Input() mostrarNomeArquivo: boolean=true;
  

  urlSpool:string=environment.totvs_spool
}

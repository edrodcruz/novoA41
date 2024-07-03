import { Component, inject, OnInit } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService46 } from 'src/app/services/totvs-service-46.service';
import { TotvsService } from 'src/app/services/totvs-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resumo-final',
  templateUrl: './resumo-final.component.html',
  styleUrl: './resumo-final.component.css'
})
export class ResumoFinalComponent implements OnInit {
  private srvTotvs = inject(TotvsService)
  private srvTotvs46 = inject(TotvsService46)

  arquivoInfoOS:string=''
  urlInfoOs:string=''
  urlSpool:string=''
  listaArquivos!:any[]
  colunasArquivos!: PoTableColumn[]

   //---Inicializar
   ngOnInit(): void {

    this.urlSpool = environment.totvs_spool
    this.colunasArquivos = this.srvTotvs46.obterColunasArquivos()

    //--- Titulo Tela
    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - RESUMO CONFERÊNCIA DE OS'})

    //--- Login Unico
    this.srvTotvs.ObterUsuario().subscribe({
      next:(response:Usuario)=>{
       
        if (response === undefined){
          this.srvTotvs.EmitirParametros({estabInfo:''})
        }
        else{
          //Arquivo Gerado
          let params:any={nrProcess: response.nrProcesso, situacao:'L'}
          this.srvTotvs46.ObterArquivo(params).subscribe({
            next:(item:any)=>{
              this.listaArquivos = item.items
            }
          })

      }}})


  }


}

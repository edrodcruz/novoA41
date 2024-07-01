import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService } from 'src/app/services/totvs-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resumo-final',
  templateUrl: './resumo-final.component.html',
  styleUrl: './resumo-final.component.css'
})
export class ResumoFinalComponent implements OnInit {
  private srvTotvs = inject(TotvsService)

  arquivoInfoOS:string=''
  urlInfoOs:string=''

   //---Inicializar
   ngOnInit(): void {

    //--- Titulo Tela
    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - RESUMO CONFERÊNCIA DE OS'})

    //--- Login Unico
    this.srvTotvs.ObterUsuario().subscribe({
      next:(response:Usuario)=>{
       
        if (response === undefined){
          this.srvTotvs.EmitirParametros({estabInfo:''})
        }
        else{
          console.log(response)
          this.arquivoInfoOS = `InfOS-${response.codEstabelecimento}-${response.codUsuario}-${response.nrProcesso.toString().padStart(8,'0')}.tmp`
          this.urlInfoOs = environment.totvs_spool + this.arquivoInfoOS

      }}})


  }


}

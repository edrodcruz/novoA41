import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['./embalagem.component.css']
})
export class EmbalagemComponent {

  //---Injection
  private srvTotvs = inject(TotvsService);
  private srvNotification = inject(PoNotificationService);
  private srvDialog = inject(PoDialogService);
  private router = inject(Router)

  codEstabel: string = '';
  codUsuario: string = '';
  nrProcess:string='';
  loadTela:boolean=false



    ngOnInit(): void {

      this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - INFORMAÇÕES DE EMBALAGEM'});

      //Login Unico
      this.srvTotvs.ObterUsuario().subscribe({
        next:(response:Usuario)=>{
          
          if (response === undefined){
            this.LogarUsuario()
          }
          else{
            this.codEstabel = response.codEstabelecimento
            this.codUsuario = response.codUsuario
            this.nrProcess  = response.nrProcesso
         }
        }
      })

     }

     LogarUsuario() {
      this.router.navigate(['seletor'], {queryParams:{redirectTo:'embalagem'}}) 
   }
}

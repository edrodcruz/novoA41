import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-reparos',
  templateUrl: './reparos.component.html',
  styleUrls: ['./reparos.component.css']
})
export class ReparosComponent {

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

    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - CRIAÇÃO DE REPAROS'});

    this.srvTotvs.ObterUsuario().subscribe({
      next:(response:Usuario)=>{
        
        if (response === undefined){
          this.LogarUsuario()
        }
        else{
          this.codEstabel = response.codEstabelecimento
          this.codUsuario = response.codUsuario
          this.nrProcess  = response.nrProcesso
          this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - CRIAÇÃO DE REPAROS'});
       }
      }
    })

   }

   LogarUsuario() {
    this.router.navigate(['seletor'], {queryParams:{redirectTo:'reparos'}}) 
 }
}


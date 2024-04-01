import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { TotvsServiceMock } from 'src/app/services/totvs-service-mock.service';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  //---------- Acessar a DOM
  @ViewChild('loginModal', { static: true }) loginModal: PoModalComponent | undefined;

  //---Injection
  private srvTotvs = inject(TotvsService)
  private srvNotification = inject(PoNotificationService)

  //---Variaveis
  codEstabel:string=''
  codUsuario:string=''
  nrProcess:number=0
  senha:string=''
  loadLogin:boolean=false

  //---Grids de Notas
  colunasNFS!: PoTableColumn[]
  colunasNFE!: PoTableColumn[]
  listaNFS!: any[]
  listaNFE!: any[]

  ngOnInit(): void {

    //--- Informacoes iniciais tela
     this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'DASHBOARD NOTA FISCAL'})

     //--- Selecionar usuario para mostrar notas no dashboard
     //this.loginModal?.open()

     //--- Obter colunas grid
     this.colunasNFE = this.srvTotvs.obterColunasNotas();
     this.colunasNFS = this.srvTotvs.obterColunasNotas();


  }

  onRefresh(){

  }

  onLogarUsuario(){

    this.loadLogin=true
    //Parametros usuario e senha
    let paramsLogin: any = { CodEstabel: this.codEstabel, CodUsuario: this.codUsuario, Senha: this.senha}
    this.srvTotvs.EmitirParametros({estabInfo:this.codEstabel, tecInfo:this.codUsuario, processoInfo:''})

    //--- Obter lista de notas de saida
    let paramsTec:any = {CodEstabel: this.codEstabel, CodTecnico: this.codUsuario}
    this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
      next: (response: any) => {
          this.nrProcess = response.nrProcesso
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

    let paramsNota:any = {CodEstabel: this.codEstabel, CodTecnico: this.codUsuario, NrProcess: this.nrProcess}
    this.srvTotvs.ObterNotas(paramsNota).subscribe({
      next: (response: any) => {
          this.listaNFS = (response as any[])
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

     //Fechar a tela de login
     this.loginModal?.close()

  }


}

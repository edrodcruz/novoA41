import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { Subscription, interval } from 'rxjs';
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
  statusProcess:number=0
  tempoProcess:number=0
  senha:string=''
  loadLogin:boolean=false

  //---Grids de Notas
  colunasNFS!: PoTableColumn[]
  colunasNFE!: PoTableColumn[]
  listaNFS!: any[]
  listaNFE!: any[]
  sub!:Subscription;

  ngOnInit(): void {

    //--- Informacoes iniciais tela
     this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'DASHBOARD NOTA FISCAL', dashboard: true})

     //--- Selecionar usuario para mostrar notas no dashboard
     this.loginModal?.open()

     //--- Obter colunas grid
     
   //  this.colunasNFS = this.srvTotvs.obterColunasNotas();

  }

  ngOnDestroy():void{
    this.sub.unsubscribe()
  }

  onRefresh(){

  }

  onLogarUsuario(){

    this.loadLogin=true
    //Parametros usuario e senha
    let paramsLogin: any = { CodEstabel: this.codEstabel, CodUsuario: this.codUsuario, Senha: this.senha}

    //Parametros da Nota
    let paramsTec:any = {codEstabel: this.codEstabel, codTecnico: this.codUsuario}

    //Chamar Método 
    this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
      next: (response: any) => {
          this.nrProcess = response.nrProcesso
          this.statusProcess = response.statusProcesso
          this.tempoProcess = response.tempoProcesso

          //console.log("Processo:", this.nrProcess )
          //console.log("Status:", this.statusProcess )
          //console.log("Tempo:", this.tempoProcess )

          //Atualizar Informacoes Tela
          this.srvTotvs.EmitirParametros({estabInfo:this.codEstabel, tecInfo:this.codUsuario, processoInfo:this.nrProcess})

          //Colunas do grid
          if (this.statusProcess === 1)
             this.colunasNFE = this.srvTotvs.obterColunasEntradas()
          else
             this.colunasNFE = this.srvTotvs.obterColunasEntradasEstoque();  

          //Chamar o programa de verificacao
          this.verificarNotas()

          //Setar o tempo para o relogio 
          this.sub = interval(this.tempoProcess).subscribe(execucao=> this.verificarNotas())
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

     //Fechar a tela de login
     this.loginModal?.close()

  }

  verificarNotas(){

  //TODO: Preciso saber qual status do processo
  //      Passo 1: Gerar NFE
  //      Passo 2: Reprocessar Notas no RE1005
  //      Passo 3: Reparos e Saídas
  this.statusProcess = 1

  if (this.statusProcess < 3){
    let paramsNota:any = {CodEstab: this.codEstabel, CodTecnico: this.codUsuario, NrProcess: this.nrProcess}
    this.srvTotvs.ObterNotas(paramsNota).subscribe({
      next: (response: any) => {
          this.listaNFS = response.items

          //Se todas as notas ja foram atualizadas enviar as entradas para atualizar estoque
          if ((this.statusProcess === 1) && (this.listaNFS.filter(nota => nota["idi-sit"] !== 3).length > 0)) {
            
          }
          else{
            //Processar Notas no re1005 pela segunda vez
            this.srvTotvs.ProcessarEntradas(paramsNota).subscribe({
                next: (response:any) => {},
                error: (e) => {}

            })
          }

          //Se as notas de entrada estiverem atualizadas no of gerar as saídas e os reparos
          if ((this.statusProcess === 2) && (this.listaNFS.filter(nota => nota["idi-sit"] !== 1).length > 0)) {
            
          } 
          else {
            //Processar as notas de saida e reparos
          }
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })
  }
}
}

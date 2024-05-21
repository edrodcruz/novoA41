import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PoAccordionItemComponent, PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { Subscription, delay, interval } from 'rxjs';
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
  @ViewChild('abrirArquivo', { static: true }) abrirArquivo: PoModalComponent | undefined;
  @ViewChild(PoAccordionItemComponent, { static: true }) item1!: PoAccordionItemComponent;

  //---Injection
  private srvTotvs = inject(TotvsService)
  private srvNotification = inject(PoNotificationService)

  //---Variaveis
  tabNFE:boolean=true
  codEstabel:string=''
  codUsuario:string=''
  rpwStatus:string=''
  nrProcess:number=0
  statusProcess:number=0
  tempoProcess:number=0
  senha:string=''
  loadLogin:boolean=false
  loadGrid: boolean = false
  loadTela:boolean=false
  usuarioLogado: boolean=false
  loadTecnico: string = ''
  placeHolderEstabelecimento:string=''
  conteudoArquivo:string=''
  mostrarInfo:boolean=false

  //ListasCombo
  listaEstabelecimentos!: any[]
  listaTecnicos!: any[]

  //---Grids de Notas
  colunasNFS!: PoTableColumn[]
  colunasNFE!: PoTableColumn[]
  listaNFS!: any[]
  listaNFE!: any[]
  sub!:Subscription;

  acaoLogin: PoModalAction = {
    action: () => {this.onLogarUsuario()},
    label: 'Selecionar'
  };


  acaoImprimir: PoModalAction = {
    action: () => {this.onImprimirConteudoArquivo()},
    label: 'Gerar PDF'
  };

  acaoSair: PoModalAction = {
    action: () => {this.abrirArquivo?.close()},
    label: 'Imprimir via RPW'
  };

  ngOnInit(): void {

    //--- Informacoes iniciais tela
     this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'HTMLA41 - DASHBOARD NOTA FISCAL', dashboard: true})

     //--- Selecionar usuario para mostrar notas no dashboard
     this.loginModal?.open()

     //--- Carregar combo de estabelecimentos
    this.placeHolderEstabelecimento = 'Aguarde, carregando lista...'
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
          this.listaEstabelecimentos = (response as any[]).sort(this.ordenarCampos(['label']))
          this.placeHolderEstabelecimento = 'Selecione um estabelecimento'
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

     //--- Obter colunas grid
     
   //  this.colunasNFS = this.srvTotvs.obterColunasNotas();

  }

  ngOnDestroy():void{
    
  }

  onRefresh(){

  }

  onImprimirConteudoArquivo(){
    let win = window.open('', '', 'height=' + window.innerHeight + ', width=' + (window.innerWidth) +', left=0, top=0');
        win?.document.open()
        win?.document.write("<html><head><meta charset='UTF-8'><title>processo-1421429.txt</title></head><style>p{ font-family: 'Courier New', Courier, monospace;font-size: 12px; font-variant-numeric: tabular-nums;}</style><body><p>")
        win?.document.write(this.conteudoArquivo.replace(/\n/gi, '<br>').replace(/\40/gi, "&nbsp;").replace(//gi, '<br>'))
        win?.document.write('</p></body></html>')
        win?.print()
        win?.document.close()
        win?.close()
    
  }

  onAbrirArquivo(){
    let params:any={nomeArquivo:'InfOS-142-84606-01527944.tmp'}
    this.loadTela=true
    this.srvTotvs.AbrirArquivo(params).subscribe({
      next: (response: any) => {
       this.conteudoArquivo = response.arquivo.replace(/\n/gi, '<br>').replace(/\40/gi, "&nbsp;").replace(//gi, '<br>')

        this.loadTela=false
        this.abrirArquivo?.open()
      },
      error: (e) => {this.loadTela=false}
    })
  
  }

  onLogarUsuario(){

    if(this.codEstabel === '' || this.codUsuario === ''){
      this.srvNotification.error("Seleção inválida, verifique !")
      return
    }

    this.loadLogin=true
    //Parametros usuario e senha
    let paramsLogin: any = { CodEstabel: this.codEstabel, CodUsuario: this.codUsuario, Senha: this.senha}
    //Chamar servico de login
    this.srvTotvs.LoginAlmoxarifado(paramsLogin).subscribe({
      next: (response: any) => {

          //if(response.senhaValida){
          if(true){

            //Parametros da Nota
            let paramsTec:any = {codEstabel: this.codEstabel, codTecnico: this.codUsuario}
          
            //Fechar a tela de login
            this.loginModal?.close()

            //Setar usuario como logado
            this.usuarioLogado = true;

            //Chamar Método 
            this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
              next: (response: any) => {
                  this.nrProcess = response.nrProcesso
                  this.statusProcess = response.statusProcesso
                  this.tempoProcess = response.tempoProcesso

                  //Atualizar Informacoes Tela
                  let estab = this.listaEstabelecimentos.find(o => o.value === this.codEstabel)
                  let tec = this.listaTecnicos.find(o => o.value === this.codUsuario)
                  this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: tec.label, processoInfo: this.nrProcess})

                  //Colunas do grid
                    this.colunasNFE = this.srvTotvs.obterColunasEntradas()
                    this.colunasNFS = this.srvTotvs.obterColunasSaidas();  

                  //Chamar o programa de verificacao
                  this.verificarNotas()

                  this.item1.expand()

                  //Setar o tempo para o relogio 
                  //this.sub = interval(this.tempoProcess).subscribe(execucao=> this.verificarNotas())
              },
              error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
            })
          }
          else{

               this.srvNotification.error("Erro na validação do usuário:"  + response.mensagem)
               this.loadLogin = false
               this.loadGrid = false
               this.usuarioLogado=false
          }

      },
      error: (e) => {
        this.srvNotification.error("Ocorreu um erro na requisição " )
        this.loadLogin = false
        this.loadGrid = false
        this.usuarioLogado=false
      }
    })
  }


verificarNotas(){
    if (!this.usuarioLogado){
      this.loginModal?.open()
    }
    else{
      //TODO: Preciso saber qual status do processo
      //      Passo 1: Gerar NFE
      //      Passo 2: Reprocessar Notas no RE1005
      //      Passo 3: Saídas
      //      Passo 4: Informacoes Embalagem
      //      Passo 5: Criacao Reparos

      if (this.statusProcess < 3){
        
        this.loadGrid = true
        let paramsNota:any = {CodEstab: this.codEstabel, CodTecnico: this.codUsuario, NrProcess: this.nrProcess}
        this.srvTotvs.ObterNotas(paramsNota).subscribe({
          next: (response: any) => {
              this.listaNFE = response.nfe
              this.listaNFS = response.nfs
              this.rpwStatus = response.rpw
              this.loadGrid = false
          },
          error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
        })
      }
    }
  }

  public onEstabChange(obj: string) {
    if (obj === undefined) return

    //Popular o Combo do Emitente
    this.listaTecnicos = []
    this.codUsuario= ''
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`

    //Chamar servico
    this.srvTotvs
      .ObterEmitentesDoEstabelecimento(obj)
      .subscribe({
        next: (response:any) => {
            delay(200)
            this.listaTecnicos = response
            this.loadTecnico = 'Selecione o técnico'
        },
        error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
      });
  }

  //------ funcao para ordenar
  //Utilize o - (menos) para indicar ordenacao descendente
  ordenarCampos = (fields: any[]) => (a: { [x: string]: number; }, b: { [x: string]: number; }) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p, n) => p ? p : n, 0);
}

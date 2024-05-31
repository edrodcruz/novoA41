import { Component,
  inject,
  OnInit,
  ViewChild, } from '@angular/core';

  import {
    PoAccordionComponent,
    PoAccordionItemComponent,
    PoDialogService,
    PoMenuItem,
    PoModalAction,
    PoModalComponent,
    PoNotificationService,
    PoTableAction,
    PoTableColumn,
    PoTableComponent,
  } from '@po-ui/ng-components';
  import { delay, Subscription } from 'rxjs';
import { TotvsService46 } from '../../services/totvs-service-46.service';
  import {
    FormBuilder,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
  } from '@angular/forms';
import { TotvsService } from 'src/app/services/totvs-service.service';
import { Usuario } from 'src/app/interfaces/usuario';


@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent {
  private srvTotvs46 = inject(TotvsService46);
  private srvTotvs = inject(TotvsService)
  private srvDialog = inject(PoDialogService)
  private srvNotification = inject(PoNotificationService);
  private formBuilder = inject(FormBuilder);
  
  //---------- Acessar a DOM
    @ViewChild('telaIncluirOrdem', { static: true }) telaIncluirOrdem: | PoModalComponent | undefined;
    @ViewChild('telaAlterarOrdem', { static: true }) telaAlterarOrdem: | PoModalComponent | undefined;

    @ViewChild('telaIncluirItemOrdem', { static: true }) telaIncluirItemOrdem:
    | PoModalComponent
    | undefined;


    @ViewChild('gridOrdens', { static: true }) gridOrdens: PoTableComponent | undefined;
    
    @ViewChild(PoAccordionComponent, { static: true }) principal!: PoAccordionComponent;
    @ViewChild(PoAccordionItemComponent, { static: true }) item1!: PoAccordionItemComponent;
    @ViewChild(PoAccordionItemComponent, { static: true }) item2!: PoAccordionItemComponent;
    @ViewChild('abrirArquivo', { static: true }) abrirArquivo:
    | PoModalComponent
    | undefined;

   //Formulario
   public form = this.formBuilder.group({
    codEstabel: ['', Validators.required],
    codUsuario: ['', Validators.required],
    senha: ['', Validators.required],
  });

  public formOrdem = this.formBuilder.group({
    numOS:[0, Validators.required],
    Chamado:[0, Validators.required],
    codEstabel:[''],
    codEmitente:[0],
    moto:[false]
  })

  public formItemOrdem = this.formBuilder.group({
    numOS:[0, Validators.required],
    chamado:[0]
  })

  acaoImprimir: PoModalAction = {
    action: () => {
      this.onImprimirConteudoArquivo();
    },
    label: 'Gerar PDF',
  };

  acaoSair: PoModalAction = {
    action: () => {
      this.abrirArquivo?.close();
    },
    label: 'Sair',
  };

  //---Variaveis
  loadTela: boolean = false
  loadGrid: boolean = false
  loadGridOrdem: boolean = false
  loadIncluirOrdem: boolean = false
  loadTecnico: string = ''
  cUsadas:any=0
  cBrancas:any=0
  cTotal:any=0
  mostrarDados:boolean=false
  edObservacao:string=''
  ordemSelecionada:any=undefined;
  cTag:string=''
  cInfoItem:string='Não há itens cadastrados'
  cOS:string=''
  cChamado:string=''

  conteudoArquivo: string = '';
  mostrarInfo: boolean = false;
  nomeArquivo: string = '';


  //ListasCombo
  listaEstabelecimentos!: any[]
  listaTecnicos!:any[]
  listaTransp!: any[]

  //---Grid
  colunasOrdens!: PoTableColumn[]
  colunasItens!: PoTableColumn[]
  
  listaOrdens!: any[]
  listaItens!: any[]
  
  sub!: Subscription;

  readonly acoesGridOrdem: PoTableAction[] =[
    {label: 'Marcar OS', icon: 'bi bi-file-earmark-check', action: this.onMarcar.bind(this)},
    {label: 'Desmarcar OS', icon: 'bi bi-file', action: this.onDesmarcar.bind(this)},
    {separator:true, label: 'Marcar Moto', icon: 'bi bi-bicycle', action: this.onMarcarMoto.bind(this)},
    {label: 'Desmarcar Moto', icon: 'bi bi-bicycle', action: this.onDesmarcarMoto.bind(this)},
    {separator: true, label: 'Alterar Chamado', icon: 'bi bi-pencil-square', action: this.onAlterarOrdem.bind(this)},
    {separator: true, label: 'Eliminar OS', icon: 'bi bi-trash', action: this.onExcluirOrdem.bind(this), type:'danger'},
  ]

  readonly acoesGridItem: PoTableAction[] =[
    {label: 'Alterar Item OS', icon: 'bi bi-pencil-square', action: this.onAlterarItemOrdem.bind(this)},
    {separator: true,label: 'Eliminar Item OS', icon: 'bi bi-trash', action: this.onExcluirItemOrdem.bind(this), type:'danger'},
  ]

  //--- Actions
  readonly opcoes: PoTableAction[] = [{
      label: '',
      icon: 'po-icon po-icon po-icon-edit',
      action: this.onSelecionarOS.bind(this),
    }];

  
  readonly acaoIncluirOrdem: PoModalAction = {
    label: 'Salvar Ordem',
    action: () => { this.incluirOrdem() },
    loading: this.loadIncluirOrdem,
    disabled: !this.formOrdem.valid
  }

  readonly acaoAlterarOrdem: PoModalAction = {
    label: 'Salvar',
    action: () => { this.alterarOrdem() },
    loading: this.loadIncluirOrdem,
    disabled: !this.formOrdem.valid
  }


  readonly acaoCancelarOrdem: PoModalAction = {
    label: 'Cancelar',
    action: () => { this.telaIncluirOrdem?.close(); this.telaAlterarOrdem?.close() }
  }

  readonly acaoIncluirItemOrdem: PoModalAction = {
    label: 'Salvar',
    action: () => { this.okIncluirItemOrdem() }
  }

  readonly acaoCancelarItemOrdem: PoModalAction = {
    label: 'Cancelar',
    action: () => { this.telaIncluirItemOrdem?.close() }
  }

  

  //---Inicializar
  ngOnInit(): void {

    //--- Titulo Tela
    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA46 - INFORME DE OS'})

    //--- Login Unico
    this.srvTotvs.ObterUsuario().subscribe({
      next:(response:Usuario)=>{
       
        if (response === undefined){
          this.srvTotvs.EmitirParametros({estabInfo:''})
        }
        else{
          this.formOrdem.controls.codEmitente.setValue(Number(response.codEstabelecimento))
          this.formOrdem.controls.codEstabel.setValue(response.codUsuario)
      }}})


    //Colunas do grid
    this.colunasOrdens = this.srvTotvs46.obterColunasOrdens()
    this.colunasItens = this.srvTotvs46.obterColunasItems()

    //this.principal.expandAllItems()
    this.item1.expand()

    //Carregar combo de estabelecimentos
    this.srvTotvs46.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
        
        this.listaEstabelecimentos = (response as any[]).sort(
          this.srvTotvs46.ordenarCampos(['label']))
      },
      error: (e) => {
        
        this.srvNotification.error('Ocorreu um erro na requisição')
        return
      },
    });
  }

  onImpressao() {
    let params:any={cRowId: this.listaOrdens[0]['c-rowId']}
    
    this.loadTela = true
    this.srvTotvs46.ImprimirOS(params).subscribe({
      next: (response:any)=>{
        this.loadTela = false
        
        this.onAbrirArquivo(response.arquivo)
      },
      error: (e)=> {this.loadTela = false}
      })
    
  }
  onConcluirSemItemNF() {}

  onIncluirItemOrdem(){this.telaIncluirItemOrdem?.open()}
  okIncluirItemOrdem(){}
  
  
  onAlterarItemOrdem(){}
  onExcluirItemOrdem(){}
  onNumeroSeriePendente(){}

  onIncluirOrdem(){
    this.formOrdem.controls.numOS.setValue(0)
    this.formOrdem.controls.Chamado.setValue(0)
    this.telaIncluirOrdem?.open()
  }

  onAlterarOrdem(obj:any){
    this.ordemSelecionada = obj;
    this.formOrdem.controls.numOS.setValue(obj.NumOS)
    this.formOrdem.controls.Chamado.setValue(obj.Chamado)
    this.telaAlterarOrdem?.open()

  }

  incluirOrdem(){
    this.loadIncluirOrdem = true
    //Setar os valores que estao na tela
    this.formOrdem.controls.codEmitente.setValue(Number(this.form.controls.codUsuario.value))
    this.formOrdem.controls.codEstabel.setValue(this.form.controls.codEstabel.value)
    this.formOrdem.controls.moto.setValue(false)

    //Montar as informacoes para enviar para api
    let params:any={paramsTela: this.formOrdem.value}

    //Criar a Ordem Servico
    this.srvTotvs46.CriarOrdem(params).subscribe({
      next: (response:any)=>{
          if (response.ordem !== undefined && response.ordem.length > 0) {
             this.listaOrdens=[...this.listaOrdens, ...response.ordem]
             this.telaIncluirOrdem?.close() 
             this.atualizarContadores() 
             this.srvNotification.success("Registro adicionado com sucesso !" )
          }
          else{
            this.srvNotification.warning("Algo de errado !" )
            this.telaIncluirOrdem?.close()
          }
          this.loadIncluirOrdem = false
          
      },
      error: (e)=> {this.loadIncluirOrdem = false}
      })
  }

  alterarOrdem(){
    this.loadIncluirOrdem = true
    //Setar os valores que estao na tela
    this.formOrdem.controls.numOS.setValue(this.ordemSelecionada.NumOS)
    this.formOrdem.controls.codEmitente.setValue(Number(this.form.controls.codUsuario.value))
    this.formOrdem.controls.codEstabel.setValue(this.form.controls.codEstabel.value)
    this.formOrdem.controls.moto.setValue(false)

    //Montar as informacoes para enviar para api
    let params:any={paramsTela: this.formOrdem.value}

    //Alterar a Ordem Servico
    this.srvTotvs46.AlterarOrdem(params).subscribe({
      next: (response:any)=>{
            this.ordemSelecionada.Chamado = this.formOrdem.controls.Chamado.value
            let registro = {...this.ordemSelecionada, value: this.ordemSelecionada.Chamado = this.formOrdem.controls.Chamado.value}
            this.gridOrdens?.updateItem(this.ordemSelecionada, registro)
            this.listaOrdens = this.gridOrdens?.items as any[]
            this.gridOrdens?.unselectRows()
            this.telaAlterarOrdem?.close()  
            this.atualizarContadores()
            this.loadIncluirOrdem = false
            this.srvNotification.success("Registro adicionado com sucesso !" )
      },
      error: (e)=> {this.loadIncluirOrdem = false}
      })
  }

  onExcluirOrdem(obj:any){
    this.ordemSelecionada = obj
    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: 'Confirma exclusão da Ordem de Serviço?',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {

        this.loadGridOrdem = true
        let params:any={cRowId: this.ordemSelecionada['c-rowId']}
        this.srvTotvs46.ExcluirOrdem(params).subscribe({
          next: (response:any)=>{
            this.loadGridOrdem = false
            this.gridOrdens?.removeItem(obj)
            this.listaOrdens = this.gridOrdens?.items as any[]
            this.gridOrdens?.unselectRows()

            this.atualizarContadores()
            this.srvNotification.success("Registro excluído com sucesso !" )
          },
          error:(e)=>{this.loadGridOrdem = false}        
        })
      },
      cancel:  () => { }
    })
  }

  selecionarOrdem(obj:any){
    this.ordemSelecionada=obj;
    //this.cInfoItem = `NumOS: ${obj.NumOS} / ${obj.Chamado}`
    this.cOS = obj.NumOS
    this.cChamado = obj.Chamado
    let params:any={cRowId: obj['c-rowId']}
    this.loadGrid = true
    this.srvTotvs46.ObterItens(params).subscribe({
      next: (response:any)=>{
        this.listaItens  = response.itens
        this.edObservacao = response.itens.length > 0 ? response.itens[0].edobservacao : ''
        this.loadGrid = false
      }
    })
  }

  selecionarItemOrdem(obj:any){
    this.edObservacao = obj !== undefined ? obj.edobservacao : ''
  }

  onLogar(){
    this.loadTela = true;
    let params:any={codEstabel: this.form.controls.codEstabel.value, codUsuario: this.form.controls.codUsuario.value, senha: this.form.controls.senha.value}
    this.srvTotvs46.ObterDados(params).subscribe({
      next: (response: any) => {
        console.log(response)
        let estab = this.listaEstabelecimentos.find(o => o.value === this.form.controls.codEstabel.value)
        let tec = this.listaTecnicos.find(o => o.value === this.form.controls.codUsuario.value)
        this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: tec.label})

        this.cTag=response.tela[0].os
        this.mostrarDados = true
        if(response.ordens !==undefined){
          this.listaOrdens = response.ordens
          this.listaItens  = response.itens
          this.edObservacao = response.itens !== undefined ? response.itens[0].edobservacao : ''
          this.cOS = response.ordens[0].NumOS
          this.cChamado = response.ordens[0].Chamado
        }
        this.cUsadas = response.tela[0].usada
        this.cBrancas = response.tela[0].branco
        this.cTotal = response.tela[0].TOTAL
        this.principal.poAccordionItems.forEach(x=> x.label === 'Informações do Técnico' ? x.collapse() : x.expand())

         

        //Parametros da Nota
        let paramsTec:any = {codEstabel: this.form.controls.codEstabel.value, codTecnico: this.form.controls.codUsuario.value}
                  
        //Chamar Método 
        this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
          next: (response: any) => {

              //Setar usuario
              this.srvTotvs.SetarUsuario(this.form.controls.codEstabel.value!, this.form.controls.codUsuario.value!, response.nrProcesso)

              //Atualizar Informacoes Tela
              this.srvTotvs.EmitirParametros({processoInfo:response.nrProcesso, processoSituacao: response.situacaoProcesso})
             
          },
          error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
        })


        this.loadTela = false
      },
      error: (e) => {
         this.loadTela = false
         this.resetarVariaveis()
       },
    });
  }

  atualizarContadores(){
    let params:any={codEstabel: this.form.controls.codEstabel.value, codUsuario: this.form.controls.codUsuario.value}
    this.srvTotvs46.ObterContadores(params).subscribe({
      next: (response: any) => {
        this.cUsadas = response.tela[0].usada
        this.cBrancas = response.tela[0].branco
        this.cTotal = response.tela[0].TOTAL
      },
      error: (e) => {
       },
    });

    
  }

  resetarVariaveis(){
     // this.item1.label = 'Informações do Técnico'
     this.srvTotvs.EmitirParametros({estabInfo: '', tecInfo:'', processoInfo:''})

      this.listaOrdens = []
      this.listaItens=[]
      this.edObservacao=''
      this.cUsadas = 0
      this.cBrancas = 0
      this.cTotal = 0
      this.cTag=''
      this.mostrarDados = false
      }

  //Marcar
  onMarcar(obj:any | null){
    this.ordemSelecionada = obj
    this.loadGridOrdem = true
    let params:any={cRowId: this.ordemSelecionada['c-rowId']}
    this.srvTotvs46.Marcar(params).subscribe({
    next: (response:any)=>{
        this.loadGridOrdem = false
        let registro = {...this.ordemSelecionada, value: this.ordemSelecionada.flag = 'X'}
        this.gridOrdens?.updateItem(this.ordemSelecionada, registro)
        this.srvNotification.success("Registro alterado com sucesso !" )
    },
    error: (e)=> {this.loadGridOrdem = false}
    })
  }

  //Desmarcar
  onDesmarcar(obj:any | null){
    this.ordemSelecionada = obj
    this.loadGridOrdem = true
    let params:any={cRowId: this.ordemSelecionada['c-rowId']}
    this.srvTotvs46.Desmarcar(params).subscribe({
      next: (response:any)=>{
        this.loadGridOrdem = false
        let registro = {...this.ordemSelecionada, value: this.ordemSelecionada.flag = ''}
        this.gridOrdens?.updateItem(this.ordemSelecionada, registro)
        this.srvNotification.success("Registro alterado com sucesso !" )
      },
      error:(e)=>{this.loadGridOrdem = false}        
    })
  }

  onMarcarMoto(obj:any | null){
    this.ordemSelecionada = obj
    if(obj.situacao === 'M') return

    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: 'Confirma a Alteração do Status para Utilizado (M)?',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {

        this.loadGridOrdem = true
        let params:any={cRowId: this.ordemSelecionada['c-rowId']}
        this.srvTotvs46.MarcarMoto(params).subscribe({
          next: (response:any)=>{
            this.atualizarContadores()
            this.loadGridOrdem = false
            let registro = {...this.ordemSelecionada, value: this.ordemSelecionada.situacao = 'M'}
            this.gridOrdens?.updateItem(this.ordemSelecionada, registro)
            this.srvNotification.success("Registro alterado com sucesso !" )
            
          },
          error:(e)=>{this.loadGridOrdem = false}        
        })
      },
      cancel:  () => { }
    })
  }

  onDesmarcarMoto(obj:any | null){
    this.ordemSelecionada = obj
    if(obj.situacao !== 'M') return

    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: 'Confirma a Alteração do Status para Utilizado (U)?',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {

        this.loadGridOrdem = true
        let params:any={cRowId: this.ordemSelecionada['c-rowId']}
        this.srvTotvs46.DesmarcarMoto(params).subscribe({
          next: (response:any)=>{
            this.atualizarContadores()
            this.loadGridOrdem = false
            let registro = {...this.ordemSelecionada, value: this.ordemSelecionada.situacao = 'U'}
            this.gridOrdens?.updateItem(this.ordemSelecionada, registro)
            this.srvNotification.success("Registro alterado com sucesso !" )
            
          },
          error:(e)=>{this.loadGridOrdem = false}        
        })
      },
      cancel:  () => { }
    })
  }

  //Selecionar OS
  onSelecionarOS(obj?: any | null) {}

  
  public onEstabChange(obj: string) {
    if (obj === undefined) return

    //Popular o Combo do Emitente
    this.listaTecnicos = []
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`

    //Chamar servico
    this.srvTotvs46
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

  onAbrirArquivo(obj: any) {
    
    this.nomeArquivo = obj;
    let params: any = { nomeArquivo: obj };
    this.loadTela = true;
    this.srvTotvs.AbrirArquivo(params).subscribe({
      next: (response: any) => {
        this.conteudoArquivo = response.arquivo
          .replace(/\n/gi, '<br>')
          .replace(/\40/gi, '&nbsp;')
          .replace(//gi, '<br>');
        this.loadTela = false;
        this.abrirArquivo?.open();
      },
      error: (e) => {
        this.loadTela = false;
      },
    });
  }

  onImprimirConteudoArquivo() {
    let win = window.open(
      '',
      '',
      'height=' +
        window.innerHeight +
        ', width=' +
        window.innerWidth +
        ', left=0, top=0'
    );
    win?.document.open();
    win?.document.write(
      "<html><head><meta charset='UTF-8'><title>" +
        this.nomeArquivo +
        "</title></head><style>p{ font-family: 'Courier New', Courier, monospace;font-size: 12px; font-variant-numeric: tabular-nums;}</style><body><p>"
    );
    win?.document.write(
      this.conteudoArquivo
        .replace(/\n/gi, '<br>')
        .replace(/\40/gi, '&nbsp;')
        .replace(//gi, '<br>')
    );
    win?.document.write('</p></body></html>');
    win?.print();
    win?.document.close();
    win?.close();
  }


}

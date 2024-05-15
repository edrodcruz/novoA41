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
  @ViewChild('telaIncluirOrdem', { static: true }) telaIncluirOrdem:
    | PoModalComponent
    | undefined;

    @ViewChild('telaIncluirItemOrdem', { static: true }) telaIncluirItemOrdem:
    | PoModalComponent
    | undefined;


    @ViewChild('gridOrdens', { static: true }) gridOrdens: PoTableComponent | undefined;
    @ViewChild(PoAccordionItemComponent, { static: true }) item1!: PoAccordionItemComponent;

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
    {separator: true, label: 'Alterar Chamado', icon: 'bi bi-pencil-square', action: this.onSelecionarOS.bind(this)},
    {separator: true, label: 'Eliminar OS', icon: 'bi bi-trash', action: this.onSelecionarOS.bind(this), type:'danger'},
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

  readonly acaoCancelarOrdem: PoModalAction = {
    label: 'Cancelar',
    action: () => { this.telaIncluirOrdem?.close() }
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
    this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'HTMLA46 - INFORME DE OS', dashboard: false, abrirMenu:false})


    //Colunas do grid
    this.colunasOrdens = this.srvTotvs46.obterColunasOrdens()
    this.colunasItens = this.srvTotvs46.obterColunasItems()

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

    //Expandir guia 1
    this.item1.expand();

  }

  onImpressao() { }
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
             this.srvNotification.success("Registro adicionado com sucesso !" )
          }
          else{
            this.srvNotification.warning("Algo de errado !" )
            this.telaIncluirOrdem?.close()
          }
          this.loadIncluirOrdem = false
          this.atualizarContadores()
      },
      error: (e)=> {this.loadIncluirOrdem = false}
      })
  }

  onExcluirOS(){}

  selecionarOrdem(obj:any){
    this.ordemSelecionada=obj;
    this.cInfoItem = `NumOS: ${obj.NumOS} / ${obj.Chamado}`
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
        this.item1.label = `Estabelecimento: ${this.form.controls.codEstabel.value} - Técnico: ${this.form.controls.codUsuario.value}`
        this.cTag=response.tela[0].os
        this.mostrarDados = true
        this.listaOrdens = response.ordens
        this.listaItens  = response.itens
        this.edObservacao = response.itens !== undefined ? response.itens[0].edobservacao : ''
        this.cInfoItem = response.ordens !== undefined ? `NumOS: ${response.ordens[0].NumOS} / ${response.ordens[0].Chamado}`: 'Não há itens cadastrados'
        this.cUsadas = response.tela[0].usada
        this.cBrancas = response.tela[0].branco
        this.cTotal = response.tela[0].TOTAL
        this.item1.collapse()
        this.loadTela = false
      },
      error: (e) => {
         this.loadTela = false
         this.resetarVariaveis()
       },
    });
  }

  atualizarContadores(){
   // this.cBrancas = Number(this.listaOrdens.filter( x => x.Chamado === 0).length)
   // this.cUsadas = Number(this.listaOrdens.filter( x => x.Chamado > 0).length)
   // this.cTotal = Number(this.cUsadas) + Number(this.cBrancas)

  }

  resetarVariaveis(){
      this.item1.label = 'Informações do Técnico'
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

    if (this.ordemSelecionada.flag === 'X') return

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
    
    if (this.ordemSelecionada.flag === '') return

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
    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: 'Confirma a Alteração do Status para Utilizado (M)?',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {

        this.loadGridOrdem = true
        let params:any={cRowId: this.ordemSelecionada['c-rowId']}
        this.srvTotvs46.MarcarMoto(params).subscribe({
          next: (response:any)=>{
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

    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: 'Confirma a Alteração do Status para Utilizado (U)?',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {

        this.loadGridOrdem = true
        let params:any={cRowId: this.ordemSelecionada['c-rowId']}
        this.srvTotvs46.DesmarcarMoto(params).subscribe({
          next: (response:any)=>{
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


}

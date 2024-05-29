import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';

import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['./embalagem.component.css']
})
export class EmbalagemComponent {

  @ViewChild('tela', { static: true }) tela: | PoModalComponent | undefined;
  @ViewChild('grid', { static: true }) grid!: | PoTableComponent;

  //---Injection
  private srvTotvs = inject(TotvsService);
  private srvNotification = inject(PoNotificationService);
  private srvDialog = inject(PoDialogService);
  private router = inject(Router)
  private formBuilder = inject(FormBuilder);

  codEstabel: string = '';
  codUsuario: string = '';
  nrProcess:string='';
  loadTela:boolean=false
  listaGrid!:any[]
  colunas!:any[]
  

  readonly acoes: PoTableAction[] = [
    {
      label: '',
      icon: 'bi bi-pencil-square',
      action: this.onEditar.bind(this),
    },
    
    ];

    readonly acaoSalvar: PoModalAction = {
      label: 'Salvar',
      action: () => { this.onSalvar() }
    }

    //Formulario
   public form_ = this.formBuilder.group({
    'nr-process': ['', Validators.required],
    'qt-volume': [0, Validators.required],
    'cod-embal': ['', Validators.required],
    'qt-embal': [0, Validators.required],
    'peso-liq': [0, Validators.required],
    'peso-bru': [0, Validators.required],
    
  });

   ngOnInit(): void {

      this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - INFORMAÇÕES DE EMBALAGEM'});
      this.colunas=this.srvTotvs.obterColunasEmbalagem()
      

      //Login Unico
      this.srvTotvs.ObterUsuario().subscribe({
        next:(response:Usuario)=>{
          if(response ===undefined) return
          console.log(response)
            this.codEstabel = response.codEstabelecimento
            this.codUsuario = response.codUsuario
            this.nrProcess  = response.nrProcesso
            this.listaGrid = ([{'nr-process':response.nrProcesso, 'qt-volume':0, 'cod-embal':'', 'qt-embal':0, 'peso-liq':0, 'peso-bru':0}])
            this.form_.setValue(this.listaGrid[0] as any)
        }
      })

     }

     onNovo(){
      this.tela?.open()
     }

     onEditar(){
      this.form_.setValue(this.listaGrid[0])
      this.tela?.open()
     }

     onEfetivar(){

      this.srvDialog.confirm({
        title: "EFETIVAR DADOS DE EMBALAGEM",
        message: `Confirma efetivação ?`,
        confirm: () => {
          this.loadTela = true
          let paramsTela: any = { paramsTela: this.listaGrid[0] }
          this.srvTotvs.InformarEmbalagem(paramsTela).subscribe({
            next: (response: any) => {},
            error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
          })
        },
        cancel: () => this.srvNotification.error("Cancelada pelo usuário")
      })
      
     }

     onSalvar(){
      
      this.listaGrid[0] = this.form_.value 
      this.grid.items = this.listaGrid
      console.log(this.listaGrid)

     this.tela?.close()

     }

     

     
}

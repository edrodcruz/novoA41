import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-reparos',
  templateUrl: './reparos.component.html',
  styleUrls: ['./reparos.component.css']
})
export class ReparosComponent {

  @ViewChild('telaAlterar', { static: true }) telaAlterar: | PoModalComponent | undefined;

//---Injection
private srvTotvs = inject(TotvsService);
private srvNotification = inject(PoNotificationService);
private srvDialog = inject(PoDialogService);
private router = inject(Router)

codEstabel: string = '';
codUsuario: string = '';
nrProcess:string='';
loadTela:boolean=false

lEQV:boolean=false

listaReparos!:any[]

colunasReparos!:PoTableColumn[]
cJustificativa!:string

readonly acaoSalvar: PoModalAction = {
  label: 'Salvar',
  action: () => { this.onSalvar() },
}


readonly acaoCancelar: PoModalAction = {
  label: 'Cancelar',
  action: () => { this.onCancelar() }
}

//--- Actions
readonly acoesGrid: PoTableAction[] = [
  {
    label: 'Editar',
    icon: 'bi bi-pencil-square',
    action: this.onEditar.bind(this),
  },
  {
    separator:true,
    label: 'Eliminar',
    icon: 'bi bi-trash',
    action: this.onDeletar.bind(this),
    type:'danger'
  }];

  ngOnInit(): void {

    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - CRIAÇÃO DE REPAROS'});
    this.loadTela = true

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

    this.colunasReparos = this.srvTotvs.obterColunasReparos()

    let params: any = { codEmitente: this.codUsuario, nrProcess: this.nrProcess }
    this.srvTotvs.ObterItensParaReparo(params).subscribe({
      next:(response:any)=>{
        console.log("ObterItensParaReparo", response)
        this.loadTela=false
        if (response === undefined){
          return
        }
        this.listaReparos = response.items

      }})
 }

 onAbrirReparos(){

  this.srvDialog.confirm({
    title: "IMPRESSÃO DE REPAROS",
    message: "Deseja imprimir o reparo",
    confirm: () => {
      this.loadTela = true
      let param:any={reparos:[{
        "codfilial":"08", 
        "qt-reparos": 1,
        "it-codigo": "85.101.00275-2b",
        "numos": 0,
        "nf-saida": "",
        "chamado": 0,
        "NTecnico": 1615,
        "nr-process": 1534492,
        "lote": 1534492,
        "numserie-ant": "0",
        "numserie-atu": "0",
        "atividade": "101",
        "defind": 201,
        "observacao": "TESTE VALTER",
        "nr-enc": 998877,
        "clisirog": "131"

      }]}
      this.srvTotvs.AbrirReparo(param).subscribe({
        next: (response:any)=> {
           this.loadTela = false
           this.srvNotification.success('Gerado pedido de execução para criação e impressão de reparos: ' + response.NumPedExec)
          }
      })
    },
    cancel: () => {}
  })
  
 }

 
 LogarUsuario() {
    this.router.navigate(['seletor'], {queryParams:{redirectTo:'reparos'}}) 
 }

 onDeletar(obj:any){
 }

 onEditar(obj:any){
  console.log(obj)
  this.telaAlterar?.open()

 }

 onSalvar(){

 }

 onCancelar(){

 }
 habilitarCampos(){

 }
}


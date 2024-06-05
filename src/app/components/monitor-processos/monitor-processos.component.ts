import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Usuario } from 'src/app/interfaces/usuario';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-monitor-processos',
  templateUrl: './monitor-processos.component.html',
  styleUrls: ['./monitor-processos.component.css']
})
export class MonitorProcessosComponent {

private srvTotvs = inject(TotvsService)
private srvNotification = inject(PoNotificationService);
private router = inject(Router)



//ListasCombo
listaEstabelecimentos!: any[];
listaTecnicos!: any[];
codEstabel: string = '';
codUsuario: string = '';
nrProcess:string=''
usuarioLogado: boolean = false;
loadTecnico: string = '';
placeHolderEstabelecimento: string = '';
loadTela: boolean = false;
redirectTo!:string
mostrarLabel:boolean=false
colunas!:PoTableColumn[]
lista!:any[]

//--- Actions
readonly acoes: PoTableAction[] = [
  {
    label: 'Entradas e Saídas',
    icon: 'bi bi-archive',
    action: this.NotasFiscais.bind(this),
  },
  {
    label: 'Reparos',
    icon: 'bi bi-tools',
    action: this.Reparos.bind(this),
  },
  {
    label: 'Embalagem',
    icon: 'bi bi-box2',
    action: this.Embalagem.bind(this),
  }

  ];

  

ngOnInit(): void {

  this.mostrarLabel=false

  this.colunas = this.srvTotvs.obterColunasMonitor()
  //this.srvTotvs.EmitirParametros({ tituloTela: 'HTMLA41 - MONITOR ACOMPANHAMENTO DE PROCESSOS'});
  this.srvTotvs.EmitirParametros({ tituloTela: 'HTMLA41 - MONITOR ACOMPANHAMENTO DE PROCESSOS', estabInfo:''});

  let monitor = this.srvTotvs.ObterMonitor()
  if (monitor !== undefined)
  {
    this.listaEstabelecimentos = monitor.listaEstab
    this.codEstabel = monitor.estabSelecionado
    //this.lista = monitor.listaGrid
    this.onListar()
  }
  else{
    
    //--- Carregar combo de estabelecimentos
    this.placeHolderEstabelecimento = 'Aguarde, carregando lista...';
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
        this.listaEstabelecimentos = (response as any[]).sort(
          this.srvTotvs.ordenarCampos(['label']));
        
        this.placeHolderEstabelecimento = 'Selecione um estabelecimento';
      },
      error: (e) => {
        //this.srvNotification.error('Ocorreu um erro na requisição');
        return;
      },
    });
  }
}

public onListar(){
  this.loadTela=true;
  let params:any={codEstabel: this.codEstabel}
  this.srvTotvs.ObterProcessosEstab(params).subscribe({
    next: (response:any)=>{
      this.lista = response.items;
      this.srvTotvs.SetarMonitor({listaEstab: this.listaEstabelecimentos, listaGrid: this.lista, estabSelecionado: this.codEstabel})
      this.loadTela = false
    },
    error: (e)=> {this.loadTela = false}
    })

}

NotasFiscais(obj:any){
  this.AbrirTela(obj, 'dashboard')
}

Embalagem(obj:any){
  if(obj.situacao === "B")
   this.AbrirTela(obj, 'embalagem')
  else
  this.srvNotification.error("Situação do processo não permite chamar esta tela !")
}

Reparos(obj:any){
  if(obj.situacao === "R")
    this.AbrirTela(obj, 'reparos')
   else
   this.srvNotification.error("Situação do processo não permite chamar esta tela !")
}

AbrirTela(obj:any, cTela:string){
  this.loadTela=true
  //Setar Estabelecimento e Usuario utilizado no calculo
  this.srvTotvs.SetarUsuario(obj["cod-estabel"], obj["cod-emitente"], obj["nr-process"])
   //Parametros da Nota
   let paramsTec: any = {codEstabel: obj["cod-estabel"], codTecnico: obj["cod-emitente"]};
  //Chamar Método
 this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
    next: (response: any) => {
      //Atualizar Informacoes Tela
      let estab = this.listaEstabelecimentos.find((o) => o.value === this.codEstabel);
      this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: `${obj['cod-emitente']} ${obj['nome-abrev']}`, processoInfo:response.nrProcesso, processoSituacao: response.situacaoProcesso})
      this.router.navigate([cTela])
    },
    //error: (e) => { this.srvNotification.error('Ocorreu um erro na requisição')},
  });
}



}

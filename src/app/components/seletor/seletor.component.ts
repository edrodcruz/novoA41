import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-seletor',
  templateUrl: './seletor.component.html',
  styleUrls: ['./seletor.component.css']
})
export class SeletorComponent {

private srvTotvs = inject(TotvsService)
private srvNotification = inject(PoNotificationService);
private route = inject(ActivatedRoute)
private router = inject(Router)

@ViewChild('loginModal', { static: true }) loginModal: | PoModalComponent | undefined;



  //ListasCombo
listaEstabelecimentos!: any[];
listaTecnicos!: any[];
codEstabel: string = '';
codUsuario: string = '';
usuarioLogado: boolean = false;
loadTecnico: string = '';
placeHolderEstabelecimento: string = '';
loadTela: boolean = false;
redirectTo!:string
mostrarLabel:boolean=false

acaoLogin: PoModalAction = {
  action: () => {this.onLogarUsuario();},
  label: 'Selecionar',
};

acaoCancelar: PoModalAction={
  action:()=> {this.router.navigate(['home'])},
  label: 'Cancelar '
}


ngOnInit(): void {

this.mostrarLabel=false
this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') as string;

this.srvTotvs.EmitirParametros({ tituloTela: 'HTMLA41 - SELETOR DE ESTABELECIMENTO E USUÁRIO', estabInfo:''});

//Abrir Login
this.loginModal?.open()

//--- Carregar combo de estabelecimentos
this.placeHolderEstabelecimento = 'Aguarde, carregando lista...';
this.srvTotvs.ObterEstabelecimentos().subscribe({
  next: (response: any) => {
    this.listaEstabelecimentos = (response as any[]).sort(
      this.srvTotvs.ordenarCampos(['label']));
    
    this.placeHolderEstabelecimento = 'Selecione um estabelecimento';
  },
  error: (e) => {
    this.srvNotification.error('Ocorreu um erro na requisição');
    return;
  },
});
}

onLogarUsuario() {
  if (this.codEstabel === '' || this.codUsuario === '') {
    this.srvNotification.error('Seleção inválida, verifique !');
    return;
  }

  this.mostrarLabel=true

  //Fechar a tela de login
  this.loginModal?.close();
  this.loadTela = true;

  //Setar usuario como logado
  this.usuarioLogado = true;

  
  //Parametros da Nota
  let paramsTec: any = {codEstabel: this.codEstabel, codTecnico: this.codUsuario};

  //Chamar Método
  this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
    next: (response: any) => {
      //Atualizar Informacoes Tela
      let estab = this.listaEstabelecimentos.find((o) => o.value === this.codEstabel);
      let tec = this.listaTecnicos.find((o) => o.value === this.codUsuario);
      this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: tec.label, processoInfo:response.nrProcesso, processoSituacao: response.situacaoProcesso})
      
      //Setar Estabelecimento e Usuario utilizado no calculo
      this.srvTotvs.SetarUsuario(this.codEstabel, this.codUsuario, response.nrProcesso)
      this.router.navigate([this.redirectTo])
      this.loadTela=false
    },
    error: (e) => {
      this.srvNotification.error('Ocorreu um erro na requisição');
      return;
    },
  });
}

public onEstabChange(obj: string) {
  if (obj === undefined) return;

  //Popular o Combo do Emitente
  this.listaTecnicos = [];
  this.codUsuario = '';
  this.loadTecnico = `Populando técnicos estab: ${obj} ...`

  //Chamar servico
  this.srvTotvs.ObterEmitentesDoEstabelecimento(obj).subscribe({
    next: (response: any) => {
      this.listaTecnicos = response;
      this.loadTecnico = 'Selecione o técnico'
    },
    error: (e) =>
      this.srvNotification.error('Ocorreu um erro na requisição '),
  });
}


}

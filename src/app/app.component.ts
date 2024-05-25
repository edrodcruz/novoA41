import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { PoMenuComponent, PoMenuItem, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { TotvsServiceMock } from './services/totvs-service-mock.service';
import { Subscription } from 'rxjs';
import { TotvsService } from './services/totvs-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private srvTotvs = inject(TotvsService)


@ViewChild('menuLateral', { static: true }) menuLateral: PoMenuComponent | undefined;


  //--------- Opcoes de Menu
 readonly menus: Array<PoMenuItem> = [
 { label:  'Tela Principal'            , icon: 'bi bi-house'         , link:'/'          , shortLabel:'Home'},
/*   { label: 'Parâmetros Filiais'        , icon: 'bi bi-gear'          , link:'/paramestab', shortLabel:'ParamEstab'}, */
  { label: 'Informe Ordem de Serviço'  , icon: 'bi bi-clipboard-data', link:'/informe'   , shortLabel:'Informe'},
  { label: 'Cálculo Auto Atendimento'  , icon: 'bi bi-calculator'    , link:'/calculo'   , shortLabel:'Cálculo'},
  { label: 'Entradas e Saídas'         , icon: 'bi bi-archive'       , link:'/dashboard' , shortLabel:'Notas'},
  { label: 'Embalagem NF'              , icon: 'bi bi-box2'          , link:'/embalagem' , shortLabel:'Embalagem'},
  { label: 'Criar Reparos'             , icon: 'bi bi-tools'         , link:'/reparos'   , shortLabel:'Reparos'}
];

//------ Label de menu principal
tecnicoInfo!: string
estabInfo!: string
processoInfo!: string
processoSituacao!:string
tituloTela!:string
dashboard:boolean=false
abrirMenu:boolean=false
abrirSeletor:boolean=false

private sub!: Subscription

constructor(private cdRef : ChangeDetectorRef){
}


ngOnInit(): void {
  this.sub = this.srvTotvs.EnviarParametros().subscribe({
    next: (response: any) => {
      this.estabInfo = response.estabInfo ?? this.estabInfo
      this.tecnicoInfo = response.tecInfo ?? this.tecnicoInfo
      this.processoInfo = response.processoInfo ?? this.processoInfo
      this.processoSituacao = response.processoSituacao ?? this.processoSituacao
      this.tituloTela = response.tituloTela ?? this.tituloTela
      this.dashboard = response.dashboard ?? this.dashboard
      this.abrirMenu = response.abrirMenu ?? true
      this.abrirSeletor = response.selecionarUsuario ?? false

      if(this.abrirMenu)
        this.menuLateral?.expand()
      else
        this.menuLateral?.collapse()
      this.cdRef.detectChanges()
    }})
}


ngOnDestroy(): void{
  this.sub.unsubscribe()
}

}

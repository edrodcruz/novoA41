import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
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


  //--------- Opcoes de Menu
 readonly menus: Array<PoMenuItem> = [
 { label:  'Tela Principal'            , icon: 'bi bi-house'         , link:'/'          , shortLabel:'Home'},
  { label: 'Parâmetros Filiais'        , icon: 'bi bi-gear'          , link:'/paramestab', shortLabel:'ParamEstab'},
  { label: 'Informe Ordem de Serviço'  , icon: 'bi bi-clipboard-data', link:'/informe'   , shortLabel:'Informe'},
  { label: 'Cálculo Auto Atendimento'  , icon: 'bi bi-calculator'    , link:'/calculo'   , shortLabel:'Cálculo'},
  { label: 'Entradas e Saídas'         , icon: 'bi bi-archive'       , link:'/dashboard' , shortLabel:'Notas'},
  { label: 'Info Embalagem NF'         , icon: 'bi bi-box2'          , link:'/nfs'       , shortLabel:'Fim NFS'},
  { label: 'Criar Reparos'             , icon: 'bi bi-tools'         , link:'/reparos'   , shortLabel:'Fim Rep'}
];

//------ Label de menu principal
tecnicoInfo!: string
estabInfo!: string
processoInfo!: string
tituloTela!:string
dashboard:boolean=false

private sub!: Subscription

constructor(private cdRef : ChangeDetectorRef){

}


ngOnInit(): void {
  this.sub = this.srvTotvs.ObterParametros().subscribe({
    next: (response: any) => {
      this.estabInfo = response.estabInfo ?? this.estabInfo
      this.tecnicoInfo = response.tecInfo ?? this.tecnicoInfo
      this.processoInfo = response.processoInfo ?? this.processoInfo
      this.tituloTela = response.tituloTela ?? this.tituloTela
      this.dashboard = response.dashboard ?? this.dashboard
      this.cdRef.detectChanges()
    }})
}

ngOnDestroy(): void{
  this.sub.unsubscribe()
}


}

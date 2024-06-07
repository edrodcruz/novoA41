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
  { label: 'Informe Ordem de Serviço'  , icon: 'bi bi-clipboard-data', link:'/informe'   , shortLabel:'Informe'},
  { label: 'Cálculo Auto Atendimento'  , icon: 'bi bi-calculator'    , link:'/calculo'   , shortLabel:'Cálculo'},
  { label: 'Monitor Processos'         , icon: 'bi bi-display'       , link:'/monitor'      , shortLabel:'Monitor Processos'},
  { label: 'Danfe (FT0518)'            , icon: 'bi bi-printer'       , shortLabel:'DANFE', action:()=>this.AbrirProgramaTotvs()}
 ]
 ;

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

AbrirProgramaTotvs(){
  let params:any={program:'ftp/ft0518.w', params:''}
  this.srvTotvs.AbrirProgramaTotvs(params).subscribe({
    next: (response:any)=> { },
    error: (e)=>{}
  })
}
   

ngOnInit(): void {
  
  this.estabInfo=''
  this.sub = this.srvTotvs.EnviarParametros().subscribe({
    next: (response: any) => {
      this.estabInfo = response.estabInfo ?? this.estabInfo
      this.tecnicoInfo = response.tecInfo ?? this.tecnicoInfo
      this.processoInfo = response.processoInfo ?? this.processoInfo
      this.processoSituacao = response.processoSituacao ?? this.processoSituacao
      this.tituloTela = response.tituloTela ?? this.tituloTela
      this.dashboard = response.dashboard ?? this.dashboard
      this.abrirMenu = response.abrirMenu ?? true
     
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

import { ChangeDetectorRef,AfterContentChecked , Component, inject, OnInit, ViewChild } from '@angular/core';
import { PoMenuComponent, PoMenuItem, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
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
 { label:  'Tela Principal'            , icon: 'bi bi-house'             , link:'/'          , shortLabel:'Home'},
  { label: 'Informe Ordem de Serviço'  , icon: 'bi bi-clipboard-data'    , link:'/informe'   , shortLabel:'Informe'},
  { label: 'Cálculo Auto Atendimento'  , icon: 'bi bi-calculator'        , link:'/calculo'   , shortLabel:'Cálculo'},
  { label: 'Monitor Processos'         , icon: 'bi bi-display'           , link:'/monitor'      , shortLabel:'Monitor Processos'},
  /* { label: 'Gerenciador Arquivos'      , icon: 'bi bi-folder2-open'      , link:'/monitor'      , shortLabel:'Monitor Processos'}, */
  { label: 'Danfe (FT0518)'            , icon: 'bi bi-printer'           , shortLabel:'FT0518', action:() => this.AbrirProgramaTotvs('ftp/ft0518.w')},
  { label: 'Consulta Nota (FT0904)'    , icon: 'bi bi-file-earmark-text' , shortLabel:'FT0904', action:() => this.AbrirProgramaTotvs('ftp/ft0904.w')}
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
teste:number=8

private sub!: Subscription

constructor(private cdRef : ChangeDetectorRef){
}

AbrirProgramaTotvs(programa:string){
  let params:any={program:programa, params:''}
  this.srvTotvs.AbrirProgramaTotvs(params).subscribe({
    next: (response:any)=> { },
    error: (e)=>{}
  })
}
   

ngOnInit(): void {
  
  this.estabInfo=''
  this.sub = this.srvTotvs.LerParametros().subscribe({
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

ngAfterContentChecked(): void {
  this.cdRef.detectChanges();
}

}

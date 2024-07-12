import { Component, OnInit, inject } from '@angular/core';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  srvTotvs = inject(TotvsService)

  ngOnInit(): void {
    //--- Informacoes iniciais tela
    this.srvTotvs.EmitirParametros({tituloTela: 'MENU PRINCIPAL - SELECIONE UMA DAS OPÇÕES', abrirMenu: false})
  }

 
  //Variavel ROWID Global
  //def new global shared var gr-ped-venda  as rowid
  //gr-ped-venda = 0x000000003f0f2186
  //run pdp/pd1001.r.
  onChamarPD1001() {
    let params={RowId: "0x000000003f0f2186"}
    this.srvTotvs.AbrirProgramaTotvs(params).subscribe({
      next: (response: any) => {
        console.log(response)
        
      }})
  
  }

  onObterVariaveisGlobais() {
    
    this.srvTotvs.ObterVariaveisGlobais().subscribe({
      next: (response: any) => {
        console.log(response)
        alert(response.UsuarioLogado)
      }})
    
  }

}

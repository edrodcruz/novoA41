
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, take, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PoTableColumn } from '@po-ui/ng-components';

//--- Header somente para DEV
const headersTotvs = new HttpHeaders(environment.totvs_header)    

@Injectable({
  providedIn: 'root'
})

export class TotvsService46 {
  private reg!:any;
  _url = environment.totvs46_url;

  constructor(private http: HttpClient ) { }

  //--------------------- INTERPRETADOR RESULTADO DE ERROS/WARNING
  public tratarErros(mensagem:any):string{
     if (mensagem.messages ==! undefined)
        return mensagem.message
      return '';
  }


//------------ Colunas Grid Saldo Terceiro
obterColunasItems(): Array<PoTableColumn> {
  return [
    { property: 'tt-seqIT', label: "Seq" },
    { property: 'it-codigo', label: "Item" },
    { property: 'Serie-Nf-Saida', label: "Série"},
    { property: 'nf-saida', label: "Nota Saída" },
    { property: 'Nat-Operacao', label: "Nat Oper" },
    { property: 'Quantidade', label: "Qtde" },
    { property: 'nr-enc', label: "Nr Enc" },
    { property: 'Evento', label: "Evento" },
    { property: 'serie-ret', label: "Série Ret." },
    { property: 'serie-ins', label: "Série Inst." },
    { property: 'envelope-seguranca', label: "Env.Seg" },
    { property: 'nr-alertas', label: "Versão" },
    { property: 'id-solicita', label: "Monitor" },
    { property: 'nr-pedido', label: "Pedido" },
    { property: 'num-serie-it', label: "Num Serie Garantia" },

  ];
}

obterColunasOrdens(): Array<PoTableColumn> {
  return [
    { property: 'flag', label: " ", color:'color-07', type: 'columnTemplate'},
    { property: 'NumOS', label: "NumOs" },
    { property: 'situacao', label: "Sit" },
    { property: 'Chamado', label: "Chamado"},
    { property: 'Serie', label: "Série" },
  ];
}

  //---------------------- COMBOBOX ESTABELECIMENTOS
  //Retorno transformado no formato {label: xxx, value: yyyy}
  public ObterEstabelecimentos(params?: any){
    return this.http.get<any>(`${this._url}/ObterEstab`, {params: params, headers:headersTotvs})
                 .pipe(
                  //tap(data => {console.log("Retorno API TOTVS => ", data)}),
                  map(item => { return item.items.map((item:any) =>  { return { label:item.codEstab + ' ' + item.nome, value: item.codEstab, codFilial: item.codFilial } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  public ObterEmitentesDoEstabelecimento(id:string){
    return this.http.get<any>(`${this._url}/ObterTecEstab?codEstabel=${id}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTec + ' ' + item.nomeAbrev, value: item.codTec  } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  //---------------------- 
  public CriarOrdem(params?: any){
    return this.http.post(`${this._url}/CriarOrdem`, params, {headers:headersTotvs})
                .pipe(take(1));
  }
  
  //---------------------- 
  public AlterarOrdem(params?: any){
     return this.http.post(`${this._url}/AlterarOrdem`, params, {headers:headersTotvs})
                .pipe(take(1));
  }

  public ExcluirOrdem(params?: any){
    return this.http.get(`${this._url}/ExcluirOrdem`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }


  //---------------------- 
  public ObterDados(params?: any){
    return this.http.get(`${this._url}/ObterDados`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- 
  public ObterContadores(params?: any){
    return this.http.get(`${this._url}/ObterContadores`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }
  
  //---------------------- 
  public ImprimirOS(params?: any){
    return this.http.get(`${this._url}/ImprimirOS`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }
  

  public ObterItens(params?: any){
    return this.http.get(`${this._url}/ObterItens`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public Marcar(params?: any){
    return this.http.get(`${this._url}/Marcar`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public Desmarcar(params?: any){
    return this.http.get(`${this._url}/Desmarcar`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public MarcarMoto(params?: any){
    return this.http.get(`${this._url}/MarcarMoto`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public DesmarcarMoto(params?: any){
    return this.http.get(`${this._url}/DesmarcarMoto`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public LeaveItemOS(params?: any){
    return this.http.post(`${this._url}/LeaveItemOS`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

  public LeaveNFS(params?: any){
    return this.http.post(`${this._url}/LeaveNFS`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }


   //Ordenacao campos num array
   public ordenarCampos =
   (fields: any[]) =>
   (a: { [x: string]: number }, b: { [x: string]: number }) =>
     fields
       .map((o) => {
         let dir = 1;
         if (o[0] === '-') {
           dir = -1;
           o = o.substring(1);
         }
         return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
       })
       .reduce((p, n) => (p ? p : n), 0);



}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, of, take, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PoTableColumn } from '@po-ui/ng-components';
import { Usuario } from '../interfaces/usuario';
import { Monitor } from '../interfaces/monitor';

//--- Header somente para DEV
const headersTotvs = new HttpHeaders(environment.totvs_header)    

@Injectable({
  providedIn: 'root'
})

export class TotvsService {
  private reg!:any;
  _url = environment.totvs_url;

  constructor(private http: HttpClient ) { }

  //--- Variavel 
  private emissorEvento$ = new Subject<any>();

  //--- Emissor 
  public EmitirParametros(valor: any) {
    this.emissorEvento$.next(valor);
  }

  //--- Observador

  public EnviarParametros() {
    return this.emissorEvento$.asObservable();
  }

  //--------------------- INTERPRETADOR RESULTADO DE ERROS/WARNING
  public tratarErros(mensagem:any):string{
     if (mensagem.messages ==! undefined)
        return mensagem.message
      return '';
  }

  public UsuarioLogado!:Usuario
  public monitorLogado!:Monitor|undefined


  //------------ Colunas Grid Saldo Terceiro
obterColunas(): Array<PoTableColumn> {
  return [
    { property: 'nomeEstabel', label: "Estab" },
    { property: 'serieEntra', label: "Série Ent" },
    { property: 'serieSai', label: "Série Sai"},
    { property: 'nomeTranspEnt', label: "Transporte Ent" },
    { property: 'nomeTranspSai', label: "Transporte Sai" },
    { property: 'codEntrega', label: "Entrega" },
    { property: 'rpw', label: "RPW" },

  ];
}

//------------ Colunas Grid Saldo Terceiro
obterColunasExtraKit(): Array<PoTableColumn> {
  return [
    { property: 'tipo', label: 'Kit' },
    { property: 'nroDocto', label: "Docto" },
    { property: 'serieDocto', label: "Série" },
    { property: 'itCodigo', label: "Item"},
    { property: 'qtSaldo', label: 'Qtde', type: 'number', color:"color-10"},
    { property: 'qtRuim', label: 'QtRuim', type: 'number', color:"color-07", visible:true},
    { property: 'descItem', label: "Descrição", width: '300px'}

  ];
}

//------------ Coluna Grid Detalhe
obterColunasTodos(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara.', type: 'number'},
    { property: 'qtPagar', label: 'Entregar', type: 'number', width: '10%', color:"color-07", visible:true},
    { property: 'qtRenovar', label: 'Renovar', type: 'number', width: '10%', color:"color-10", visible:true},
    { property: 'qtExtrakit', label: 'ET', type: 'number', width: '10%', color:"color-10", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasPagar(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtPagar', label: 'Entregar', type: 'number', color:"color-07", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasRenovar(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtRenovar', label: 'Renovar', type: 'number', color:"color-10", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasExtrakit(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtExtrakit', label: 'ExtraKit', type: 'number', color:"color-10", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasSemSaldo(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtPagar', label: 'Não Atendida', type: 'number', color:"color-08", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'kit', label: "Kit"},
  ];
}

obterColunasEntradas(): Array<PoTableColumn> {
  return [
    { property: 'idi-sit', label: 'Sefaz', type: 'label',
    labels: [
      { value: 1,  color: 'color-08', label: 'NFe não autorizada', textColor:'white' },
      { value: 2,  color: 'color-08', label: 'Em Processamento', textColor:'white' },
      { value: 3,  color: 'color-10', label: 'Autorizada', textColor:'white' },
      { value: 4,  color: 'color-07', label: 'Uso denegado', textColor:'white' },
      { value: 5,  color: 'color-07', label: 'Docto Rejeitado', textColor:'white' },
      { value: 6,  color: 'color-07', label: 'Docto Cancelado', textColor:'white' },
      { value: 7,  color: 'color-07', label: 'Docto Inutilizado', textColor:'white' },
      { value: 8,  color: 'color-08', label: 'Em processamento no Aplicativo de Transmissão', textColor:'white' },
      { value: 9,  color: 'color-08', label: 'Em processamento na SEFAZ', textColor:'white' },
      { value: 10, color: 'color-08', label: 'Em processamento no SCAN', textColor:'white' },
      { value: 11, color: 'color-10', label: 'NF-e Gerada', textColor:'white' },
      { value: 12, color: 'color-08', label: 'NF-e em Processo de Cancelamento', textColor:'white' },
      { value: 13, color: 'color-08', label: 'NF-e em Processo de Inutilizacao', textColor:'white' },
      { value: 14, color: 'color-08', label: 'NF-e Pendente de Retorno', textColor:'white' },
      { value: 15, color: 'color-07', label: 'DPEC recebido pelo SCE', textColor:'white' },
      { value: 98, color: 'color-08', label: 'Aguard.Proc reapi0190', textColor:'white' },
      { value: 99, color: 'color-08', label: 'Aguard.Proc.re1005rp', textColor:'white' },
      { value: 100, color: 'color-10', label: 'Nota Atualizada Estoque', textColor:'white' },
      { value: 101, color: 'color-07', label: 'Situação desconhecida', textColor:'white' },
      { value: 102, color: 'color-07', label: 'ERRO verificar pendências', textColor:'white' },
      { value: 103, color: 'color-08', label: 'Aguardando Reprocessamento', textColor:'white' },
      
      
    ]},
    { property: 'cod-estabel', label:"Estab"},
    { property: 'cod-emitente', label:"Emitente"},
    { property: 'serie-docto', label:"Serie"},
    { property: 'nro-docto', label:"Docto"},
    { property: 'nat-operacao', label:"Nat.Oper"}
  ]
}

obterColunasSaidas(): Array<PoTableColumn> {
  return [
    { property: 'idi-sit', label: 'Sefaz', type: 'label',
    labels: [
      { value: 1,  color: 'color-08', label: 'NFe não autorizada', textColor:'white' },
      { value: 2,  color: 'color-08', label: 'Em Processamento', textColor:'white' },
      { value: 3,  color: 'color-10', label: 'Autorizada', textColor:'white' },
      { value: 4,  color: 'color-07', label: 'Uso denegado', textColor:'white' },
      { value: 5,  color: 'color-07', label: 'Docto Rejeitado', textColor:'white' },
      { value: 6,  color: 'color-07', label: 'Docto Cancelado', textColor:'white' },
      { value: 7,  color: 'color-07', label: 'Docto Inutilizado', textColor:'white' },
      { value: 8,  color: 'color-08', label: 'Em processamento no Aplicativo de Transmissão', textColor:'white' },
      { value: 9,  color: 'color-08', label: 'Em processamento na SEFAZ', textColor:'white' },
      { value: 10, color: 'color-08', label: 'Em processamento no SCAN', textColor:'white' },
      { value: 11, color: 'color-10', label: 'NF-e Gerada', textColor:'white' },
      { value: 12, color: 'color-08', label: 'NF-e em Processo de Cancelamento', textColor:'white' },
      { value: 13, color: 'color-08', label: 'NF-e em Processo de Inutilizacao', textColor:'white' },
      { value: 14, color: 'color-08', label: 'NF-e Pendente de Retorno', textColor:'white' },
      { value: 15, color: 'color-07', label: 'DPEC recebido pelo SCE', textColor:'white' },
      { value: 99, color: 'color-08', label: 'Aguardando NFE', textColor:'white' },
      { value: 100, color: 'color-10', label:'Nota Atualizada Estoque', textColor:'white'},
      { value: 102, color: 'color-07', label: 'ERRO verificar pendências', textColor:'white' },
      { value: 103, color: 'color-08', label: 'Aguardando Reprocessamento', textColor:'white' },
    ]},
    { property: 'cod-estabel', label:"Estab"},
    { property: 'serie', label:"Série"},
    { property: 'nr-nota-fis', label:"Nr Nota"},
    { property: 'nome-ab-cli', label:"Emitente"},
    { property: 'nat-operacao', label:"Nat.Oper"}
  ]
}

obterColunasEntradasEstoque(): Array<PoTableColumn> {
  return [
    { property: 'idi-sit', label: 'Estoque', type: 'label',
    labels: [
      { value: 0,  color: 'color-07', label: 'Não atualizada' },
      { value: 1,  color: 'color-10', label: 'Atualizada' },
    ]},
    { property: 'cod-estabel', label:"Estab"},
    { property: 'cod-emitente', label:"Emitente"},
    { property: 'serie-docto', label:"Serie"},
    { property: 'nro-docto', label:"Docto"},
    { property: 'nat-operacao', label:"Nat.Oper"}
  ]
}

obterColunasErrosProcessamento(): Array<PoTableColumn>{
  return [
    {property: 'nomeArquivo', label: "Arquivo"},
    {property: 'mensagemErro', label: "Mensagem"},
   
  ]
}

obterColunasReparos(): Array<PoTableColumn>{
  return [
    {property:'opcoes', label: " ", type:'cellTemplate'},
    {property: 'cod-estabel', label: "Estab"},
    {property: 'codFilial', label: "Filial"},
    {property: 'it-codigo', label: "Item"},
    {property: 'quantidade', label: "Qtd.Reparos"},
    {property: 'tem-equival', label: "EQV", type: 'columnTemplate'},
    {property: 'it-equival', label: "Item Equivalente"},
    {property: 'nr-enc', label: "ENC"},
    {property: 'num-serie-it', label: "Num.Serie Garantia"},
  ]
}

obterColunasMonitor():Array<PoTableColumn>{
  return [
    {property:'opcoes', label: " ", type:'cellTemplate'},
    {property: 'cod-emitente', label: "Técnico"},
    {property: 'nome-abrev', label: 'Nome'},
    {property: 'nr-process', label: "Processo"},
    {property: 'situacao', label: "Situação", type:'label',
      labels: [
        { value: 'I',  color: 'color-08', label: 'Impresso', textColor:'white' },
        { value: 'B',  color: 'color-07', label: 'Embalagem', textColor:'white' },
        { value: 'E',  color: 'color-10', label: 'Entradas', textColor:'white' },
        { value: 'S',  color: 'color-10', label: 'Saídas', textColor:'white' },
        { value: 'R',  color: 'color-07', label: 'Reparo', textColor:'white' },
      ]},
  ]
}

obterColunasEmbalagem():Array<PoTableColumn>{
  return [
    {property:'opcoes', label: " ", type:'cellTemplate'},
    {property:"qt-volume", label:"Volumes"},
    {property:"cod-embal", label:"Embalagem"},
    {property:"qt-embal", label:"Qtd Embalagem"},
    {property:"peso-liq", label:"Peso Liq."},
    {property:"peso-bru", label:"Peso Bru"}
  ]
}

public ObterUsuario():Observable<Usuario>{
  return of(this.UsuarioLogado).pipe(take(1))
}

public SetarUsuario(estab:string, usuario:string, processo:string){
  this.UsuarioLogado={codEstabelecimento:estab, codUsuario:usuario, nrProcesso:processo}
}

public SetarMonitor(monitor?:Monitor){
  this.monitorLogado = monitor?? undefined;
}

public ObterMonitor(monitor?:Monitor){
  return this.monitorLogado!;
}

  //---------------------- COMBOBOX ESTABELECIMENTOS
  //Retorno transformado no formato {label: xxx, value: yyyy}
  public ObterEstabelecimentos(params?: any){
    return this.http.get<any>(`${this._url}/ObterEstab`, {params: params, headers:headersTotvs})
                 .pipe(
                  ///tap(data => {console.log("Retorno API TOTVS => ", data)}),
                  map(item => { return item.items.map((item:any) =>  { return { label:item.codEstab + ' ' + item.nome, value: item.codEstab, codFilial: item.codFilial } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  //---------------------- COMBOBOX TECNICOS
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterEmitentesDoEstabelecimento(id:string){
    return this.http.get<any>(`${this._url}/ObterTecEstab?codEstabel=${id}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTec + ' ' + item.nomeAbrev, value: item.codTec  } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  //Parametros do Estabelecimento
  public ObterParamsDoEstabelecimento(id:string){
    return this.http.get<any>(`${this._url}/ObterParamsEstab?codEstabel=${id}`, {headers:headersTotvs})
                 .pipe(take(1));
  }


  //---------------------- COMBOBOX TRANSPORTES
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterTransportadoras(){
    return this.http.get<any>(`${this._url}/ObterTransp`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTransp + ' ' + item.nomeAbrev, value: item.codTransp  } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  //---------------------- COMBOBOX ENTREGA
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterEntrega(param:any){
    return this.http.get<any>(`${this._url}/ObterEntrega?codTecnico=${param.codTecnico}&codEstabel=${param.codEstabel}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return {
                                  nrProcesso: item.nrProcesso,
                                  listaEntrega: item.listaEntrega.map((x:any) =>  { return {
                                         label: x.codEntrega + ' ' + x.nomeAbrev,
                                         value: x.codEntrega,
                                         cidade: x.nomeAbrev
                                  }})}}),
                  take(1))
  }

  //---------------------- Eliminar por id
  public EliminarPorId(params?: any){
    return this.http.post(`${this._url}/EliminarPorId`, params, {headers:headersTotvs})
                .pipe(take(1));
  }
  

  //---------------------- GRID EXTRAKIT
  public ObterExtraKit(params?: any){
    return this.http.post(`${this._url}/ObterExtrakit`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Resumo
  public PrepararResumo(params?: any){
    return this.http.post(`${this._url}/PrepararCalculo`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

    //---------------------- Resumo
    public AprovarCalculo(params?: any){
      return this.http.post(`${this._url}/AprovarCalculo`, params, {headers:headersTotvs})
                     .pipe(take(1));
    }

     //---------------------- Resumo
     public ReprocessarCalculo(params?: any){
      return this.http.post(`${this._url}/ReprocessarCalculo`, params, {headers:headersTotvs})
                     .pipe(take(1));
    }

    //---------------------- Processar Entradas
    public ProcessarEntradas(params?: any){
      return this.http.post(`${this._url}/ProcessarEntradas`, params, {headers:headersTotvs})
                     .pipe(take(1));
    }

    //---------------------- Processar Entradas
    public ProcessarSaidasReparos(params?: any){
      return this.http.post(`${this._url}/ProcessarSaidasReparos`, params, {headers:headersTotvs})
                      .pipe(take(1));
    }
    

  //---------------------- Login
  public LoginAlmoxarifado(params?: any){
    return this.http.post(`${this._url}/LoginAlmoxa`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Variaveis Globais
  public ObterVariaveisGlobais(params?: any){
    return this.http.get(`${this._url}/ObterVariaveisGlobais`, {params, headers:headersTotvs})
                   .pipe(take(1));
  }

    //---------------------- Processo
    public ObterNrProcesso(params?: any){
      return this.http.get(`${this._url}/ObterNrProcesso`, {params, headers:headersTotvs})
                     .pipe(take(1));
    }
  

  //---------------------- Login
  public ObterNotas(params?: any){
    return this.http.post(`${this._url}/ObterNotas`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Salvar registro
  public Salvar(params?: any){
    return this.http.post(`${this._url}/SalvarCalcEstab`, params, {headers:headersTotvs})
                .pipe(take(1));
  }
  

  //---------------------- Obter Lista
  public Obter(params?: any){
    return this.http.get(`${this._url}/ObterCalcEstab`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Deletar registro
  public Deletar(params?: any){
    return this.http.get(`${this._url}/DeletarCalcEstab`, {params:params, headers:headersTotvs})
                    .pipe(take(1));
  }

  //---------------------- Abrir Arquivos
  public AbrirArquivo(params?: any){
    return this.http.get(`${this._url}/AbrirArquivo`, {params:params, headers:headersTotvs})
                    .pipe(take(1));
  }

  //Parametros do Estabelecimento
  public ObterProcessosEstab(params?: any){
    return this.http.get(`${this._url}/ObterProcessosEstab`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

   //---------------------- Salvar registro
   public InformarEmbalagem(params?: any){
    return this.http.post(`${this._url}/InformarEmbalagem`, params, {headers:headersTotvs})
                .pipe(take(1));
  }

  public ObterItensParaReparo(params?: any){
    return this.http.get(`${this._url}/ObterItensParaReparo`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Programas DDK
  public AbrirProgramaTotvs(params?: any){
    return this.http.get('/totvs-menu/rest/exec', {params, headers:headersTotvs})
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





import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalculoComponent } from './components/calculo/calculo.component';
import { HomeComponent } from './components/home/home.component';
import { InformeComponent } from './components/informe/informe.component';
import { ParamestabComponent } from './components/paramestab/paramestab.component';
import { EmbalagemComponent } from './components/embalagem/embalagem.component';
import { ReparosComponent } from './components/reparos/reparos.component';
import { SeletorComponent } from './components/seletor/seletor.component';
import { MonitorProcessosComponent } from './components/monitor-processos/monitor-processos.component';
import { ResumoFinalComponent } from './components/resumo-final/resumo-final.component';
import { BtnDownloadComponent } from './components/btn-download/btn-download.component';
import { CardComponent } from './components/card/card.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalculoComponent,
    HomeComponent,
    InformeComponent,
    ParamestabComponent,
    EmbalagemComponent,
    ReparosComponent,
    SeletorComponent,
    MonitorProcessosComponent,
    ResumoFinalComponent,
    BtnDownloadComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    PoTemplatesModule
  ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent]

})
export class AppModule { }

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

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalculoComponent,
    HomeComponent,
    InformeComponent
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

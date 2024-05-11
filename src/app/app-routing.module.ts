import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalculoComponent } from './components/calculo/calculo.component';
import { HomeComponent } from './components/home/home.component';
import { InformeComponent } from './components/informe/informe.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path:'informe', component:InformeComponent},
  {path:'home', component:HomeComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'calculo', component:CalculoComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

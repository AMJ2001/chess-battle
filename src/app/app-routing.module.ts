import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { IframeComponent } from './pages/iframe/iframe.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'iframe', component: IframeComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
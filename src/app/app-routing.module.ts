import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapViewComponent} from "./components/map-view/map-view.component";

const routes: Routes = [
  {path: '', component: MapViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

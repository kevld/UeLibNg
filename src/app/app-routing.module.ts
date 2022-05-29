import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetComponent } from './asset/components/asset/asset.component';
import { ProjectComponent } from './project/components/project/project.component';

const routes: Routes = [
  { path: 'projects', component: ProjectComponent },
  { path: 'assets', component: AssetComponent },
  { path: '', redirectTo: 'projects', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

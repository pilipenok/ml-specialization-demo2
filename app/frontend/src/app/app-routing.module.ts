import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { NewDatasetComponent } from './components/new-dataset/new-dataset.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
      {path: '', component: DatasetListComponent, canActivate: [AuthGuard]},
      {path: 'dataset/:datasetId', component: DatasetDetailsComponent, canActivate: [AuthGuard]},
      {path: 'new-dataset', component: NewDatasetComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

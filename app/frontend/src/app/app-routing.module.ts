import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { NewDatasetComponent } from './components/new-dataset/new-dataset.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
      {path: '', component: DatasetListComponent},
      {path: 'dataset/:datasetId', component: DatasetDetailsComponent},
      {path: 'new-dataset', component: NewDatasetComponent},
      {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

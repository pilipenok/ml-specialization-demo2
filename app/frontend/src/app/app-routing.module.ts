/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { NewDatasetComponent } from './components/new-dataset/new-dataset.component';
import { LoginComponent } from './components/login/login.component';
import { ModelComponent } from './components/model/model.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginPageGuard } from './guard/login-page.guard';

const routes: Routes = [
      {path: '', component: DatasetListComponent, canActivate: [AuthGuard]},
      {path: 'dataset/:datasetId', component: DatasetDetailsComponent, canActivate: [AuthGuard]},
      {path: 'new-dataset', component: NewDatasetComponent, canActivate: [AuthGuard]},
      {path: 'model', component: ModelComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent, canActivate: [LoginPageGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { NewDatasetComponent } from './components/new-dataset/new-dataset.component';
import { LoginComponent } from './components/login/login.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/compat/functions';

import { environment } from '../environments/environment';
import { DeleteDatasetDialogComponent } from './components/delete-dataset-dialog/delete-dataset-dialog.component';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import { USE_EMULATOR as USE_STORAGE_EMULATOR } from '@angular/fire/compat/storage';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';
import { MenuComponent } from './components/menu/menu.component';
import { ModelComponent } from './components/model/model.component';

@NgModule({
  declarations: [
    AppComponent,
    DatasetListComponent,
    NewDatasetComponent,
    LoginComponent,
    TopBarComponent,
    DatasetDetailsComponent,
    DeleteDatasetDialogComponent,
    MenuComponent,
    ModelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatSidenavModule,
    MatMenuModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule
  ],
  providers: [
    { provide: BUCKET, useValue: 'epm-spec-black-friday' },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useFirestoreEmulators ? ['localhost', 8080] : undefined },
    { provide: USE_STORAGE_EMULATOR, useValue: environment.useStorageEmulators ? ['localhost', 9199] : undefined },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useFunctionsEmulators ? ['localhost', 5001] : undefined },
    { provide: REGION, useValue: 'us-central1' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

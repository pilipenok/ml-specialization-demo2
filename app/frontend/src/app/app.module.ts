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

@NgModule({
  declarations: [
    AppComponent,
    DatasetListComponent,
    NewDatasetComponent,
    LoginComponent,
    TopBarComponent,
    DatasetDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

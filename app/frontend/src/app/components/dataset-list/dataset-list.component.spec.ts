/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetListComponent } from './dataset-list.component';
import { provideRouter } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment'; // Adjust the path to your environment file
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DatasetListComponent', () => {
  let component: DatasetListComponent;
  let fixture: ComponentFixture<DatasetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatasetListComponent,
        MatTableModule,
        MatDialogModule,
        CommonModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        BrowserAnimationsModule // Import BrowserAnimationsModule
      ],
      providers: [
        provideRouter([]), // Provide an empty router configuration for testing
        AuthService, // Add any additional services here
        { provide: MatDialogRef, useValue: {} }, // Provide MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} } // Provide MAT_DIALOG_DATA if needed
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

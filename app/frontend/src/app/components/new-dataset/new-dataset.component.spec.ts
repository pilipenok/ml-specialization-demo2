/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDatasetComponent } from './new-dataset.component';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment'; // Adjust the path to your environment file
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

describe('NewDatasetComponent', () => {
  let component: NewDatasetComponent;
  let fixture: ComponentFixture<NewDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewDatasetComponent,
        CommonModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        BrowserAnimationsModule, // Import BrowserAnimationsModule
        MatFormFieldModule, // Import MatFormFieldModule
        MatInputModule, // Import MatInputModule
        MatSelectModule, // Import MatSelectModule
        MatButtonModule // Import MatButtonModule
      ],
      providers: [
        provideRouter([]), // Provide an empty router configuration for testing
        AuthService // Add any additional services here
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

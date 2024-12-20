/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { AuthService } from '../../services/auth.service';
import { provideRouter } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async () => {
    const authServiceMock = {
      isSignedIn: jasmine.createSpy('isSignedIn').and.returnValue(true),
      signOut: jasmine.createSpy('signOut')
    };

    await TestBed.configureTestingModule({
      imports: [
        TopBarComponent,
        MatIconModule,
        CommonModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]) // Provide an empty router configuration for testing
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

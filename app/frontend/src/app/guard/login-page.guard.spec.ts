/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { TestBed } from '@angular/core/testing';

import { LoginPageGuard } from './login-page.guard';

describe('LoginPageGuard', () => {
  let guard: LoginPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

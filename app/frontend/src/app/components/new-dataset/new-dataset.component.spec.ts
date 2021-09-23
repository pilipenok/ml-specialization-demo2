/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatasetComponent } from './new-dataset.component';

describe('NewDatasetComponent', () => {
  let component: NewDatasetComponent;
  let fixture: ComponentFixture<NewDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDatasetComponent ]
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

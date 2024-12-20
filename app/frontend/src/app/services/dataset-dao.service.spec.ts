/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { TestBed } from '@angular/core/testing';
import { DatasetDaoService } from './dataset-dao.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../../environments/environment'; // Adjust the path to your environment file

describe('DatasetDaoService', () => {
  let service: DatasetDaoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      providers: [
        DatasetDaoService
      ]
    }).compileComponents();

    service = TestBed.inject(DatasetDaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DatasetDaoService } from './dataset-dao.service';

describe('DatasetDaoService', () => {
  let service: DatasetDaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetDaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

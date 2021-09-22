import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDatasetDialogComponent } from './delete-dataset-dialog.component';

describe('DeleteDatasetDialogComponent', () => {
  let component: DeleteDatasetDialogComponent;
  let fixture: ComponentFixture<DeleteDatasetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDatasetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDatasetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

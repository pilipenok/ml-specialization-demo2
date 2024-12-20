import { TestBed } from '@angular/core/testing';
import { PredictionsService } from './predictions.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../../environments/environment'; // Adjust the path to your environment file

describe('PredictionsService', () => {
  let service: PredictionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      providers: [
        PredictionsService
      ]
    }).compileComponents();

    service = TestBed.inject(PredictionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

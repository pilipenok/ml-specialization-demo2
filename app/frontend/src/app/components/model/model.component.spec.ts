import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelComponent } from './model.component';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment'; // Adjust the path to your environment file
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

describe('ModelComponent', () => {
  let component: ModelComponent;
  let fixture: ComponentFixture<ModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModelComponent,
        CommonModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
      ],
      providers: [
        provideRouter([]), // Provide an empty router configuration for testing
        AuthService // Add any additional services here
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

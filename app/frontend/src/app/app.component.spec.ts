import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment'; // Adjust the path to your environment file
import { AuthService } from './services/auth.service'; // Adjust the path as necessary
import { TopBarComponent } from './components/top-bar/top-bar.component'; // Adjust the path as necessary
import { MenuComponent } from './components/menu/menu.component'; // Adjust the path as necessary

describe('AppComponent', () => {
  beforeEach(async () => {
    const authServiceMock = {
      isSignedIn: jasmine.createSpy('isSignedIn').and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        CommonModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        TopBarComponent, // Import TopBarComponent as it is standalone
        MenuComponent // Import MenuComponent as it is standalone
      ],
      providers: [
        provideRouter([]), // Provide an empty router configuration for testing
        { provide: AuthService, useValue: authServiceMock }
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('frontend app is running!');
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginComponent } from './login.component';
import { AuthUseCase } from 'src/app/infrastructure/use-cases/auth/auth.use-case';
import { NotificationsService } from 'src/src/app/services/notifications.service';
import { CustomizerSettingsService } from 'src/app/_layout/customizer-settings/customizer-settings.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authUseCaseSpy: jasmine.SpyObj<AuthUseCase>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let themeServiceSpy: jasmine.SpyObj<CustomizerSettingsService>;
  let loginSubject: Subject<boolean>;

  beforeEach(async () => {
    const authUseCaseMock = jasmine.createSpyObj('AuthUseCase', ['login']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationsService', [
      'showToastErrorMessage', 
      'showToastSuccessMessage'
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const themeServiceMock = jasmine.createSpyObj('CustomizerSettingsService', [
      'isDark', 
      'isRTLEnabled'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthUseCase, useValue: authUseCaseMock },
        { provide: NotificationsService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: CustomizerSettingsService, useValue: themeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    authUseCaseSpy = TestBed.inject(AuthUseCase) as jasmine.SpyObj<AuthUseCase>;
    notificationServiceSpy = TestBed.inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    themeServiceSpy = TestBed.inject(CustomizerSettingsService) as jasmine.SpyObj<CustomizerSettingsService>;

    loginSubject = new Subject<boolean>();
    authUseCaseSpy.login.and.returnValue(loginSubject);
    themeServiceSpy.isDark.and.returnValue(false);
    themeServiceSpy.isRTLEnabled.and.returnValue(false);

    fixture.detectChanges();
  });

  afterEach(() => {
    if (typeof fixture !== 'undefined') {
      fixture.destroy();
    }
  });

  describe('Inicialización', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario con campos vacíos', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('debería tener validadores requeridos', () => {
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');

      emailControl?.markAsTouched();
      passwordControl?.markAsTouched();

      expect(emailControl?.hasError('required')).toBeTrue();
      expect(passwordControl?.hasError('required')).toBeTrue();
    });
  });

  describe('Validación de formulario', () => {
    it('debería ser inválido cuando los campos están vacíos', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('debería ser válido con credenciales correctas', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(component.loginForm.valid).toBeTrue();
    });

    it('debería mostrar mensaje de error para email requerido', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched();
      emailControl?.setValue('');

      const errorMessage = component.getEmailErrorMessage();

      expect(errorMessage).toBe('El correo es requerido');
    });

    it('debería mostrar mensaje de error para email inválido', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched();
      emailControl?.setValue('invalid-email');

      const errorMessage = component.getEmailErrorMessage();

      expect(errorMessage).toBe('Ingrese un correo válido');
    });

    it('debería mostrar mensaje de error para contraseña requerida', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      passwordControl?.setValue('');

      const errorMessage = component.getPasswordErrorMessage();

      expect(errorMessage).toBe('La contraseña es requerida');
    });

    it('debería mostrar mensaje de error para contraseña corta', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      passwordControl?.setValue('short');

      const errorMessage = component.getPasswordErrorMessage();

      expect(errorMessage).toBe('La contraseña debe tener al menos 8 caracteres');
    });
  });

  describe('Envío del formulario', () => {
    it('debería mostrar error cuando el formulario es inválido', () => {
      component.loginForm.patchValue({
        email: '',
        password: ''
      });

      component.onSubmit();

      expect(notificationServiceSpy.showToastErrorMessage).toHaveBeenCalled();
    });

    it('debería llamar al servicio de login con credenciales válidas', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      component.loginForm.patchValue(credentials);

      component.onSubmit();

      expect(authUseCaseSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(component.isLoading).toBeTrue();
    });

    it('debería mostrar mensaje de éxito y navegar después de login exitoso', fakeAsync(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      authUseCaseSpy.login.and.returnValue(of(true));

      component.onSubmit();
      tick();
      tick(300);

      expect(notificationServiceSpy.showToastSuccessMessage)
        .toHaveBeenCalledWith('Inicio de sesión exitoso');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/users/list']);
    }));

    it('debería manejar error 401', fakeAsync(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      authUseCaseSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

      component.onSubmit();
      tick();

      expect(notificationServiceSpy.showToastErrorMessage)
        .toHaveBeenCalledWith('Credenciales inválidas');
      expect(component.isLoading).toBeFalse();
    }));

    it('debería manejar error 429', fakeAsync(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      authUseCaseSpy.login.and.returnValue(throwError(() => ({ status: 429 })));

      component.onSubmit();
      tick();

      expect(notificationServiceSpy.showToastErrorMessage)
        .toHaveBeenCalledWith('Demasiados intentos. Espere un momento.');
    }));

    it('debería manejar error de servidor', fakeAsync(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      authUseCaseSpy.login.and.returnValue(throwError(() => ({ status: 500 })));

      component.onSubmit();
      tick();

      expect(notificationServiceSpy.showToastErrorMessage)
        .toHaveBeenCalledWith('Error del servidor. Intente más tarde.');
    }));

    it('no debería enviar el formulario cuando está cargando', () => {
      component.isLoading = true;
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authUseCaseSpy.login).not.toHaveBeenCalled();
    });
  });

  describe('Interfaz de usuario', () => {
    it('debería alternar visibilidad de contraseña', () => {
      const event = new Event('click');
      spyOn(event, 'preventDefault');
      expect(component.hidePassword).toBeTrue();

      component.togglePasswordVisibility(event);

      expect(component.hidePassword).toBeFalse();
      expect(event.preventDefault).toHaveBeenCalled();

      component.togglePasswordVisibility(event);

      expect(component.hidePassword).toBeTrue();
    });

    it('debería deshabilitar submit cuando está cargando', () => {
      component.isLoading = true;

      expect(component.canSubmit).toBeFalse();

      component.isLoading = false;
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(component.canSubmit).toBeTrue();
    });
  });

  describe('Métodos de template', () => {
    it('debería marcar todos los controles como touched', () => {
      const formGroup = component.loginForm;

      component['markFormGroupTouched'](formGroup);

      expect(formGroup.get('email')?.touched).toBeTrue();
      expect(formGroup.get('password')?.touched).toBeTrue();
    });
  });

  describe('Ciclo de vida', () => {
    it('debería destruir observables en ngOnDestroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Pruebas de integración con el template', () => {
    it('debería mostrar botón deshabilitado cuando el formulario es inválido', () => {
      component.loginForm.patchValue({
        email: '',
        password: ''
      });
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button[type="submit"]'));

      expect(button.nativeElement.disabled).toBeTrue();
    });

    it('debería mostrar botón habilitado cuando el formulario es válido', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button[type="submit"]'));

      expect(button.nativeElement.disabled).toBeFalse();
    });

    it('debería mostrar spinner cuando está cargando', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('mat-spinner'));

      expect(spinner).toBeTruthy();
    });
  });
});
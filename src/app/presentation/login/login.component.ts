import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CustomizerSettingsService } from 'src/app/_layout/customizer-settings/customizer-settings.service';
import { AuthUseCase } from 'src/app/infrastructure/use-cases/auth/auth.use-case';
import { NotificationsService } from 'src/src/app/services/notifications.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm!: FormGroup;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authUseCase: AuthUseCase,
    private notificationService: NotificationsService,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      
      if (this.loginForm.get('email')?.invalid) {
        this.notificationService.showToastErrorMessage(
          this.getEmailErrorMessage()
        );
      } else if (this.loginForm.get('password')?.invalid) {
        this.notificationService.showToastErrorMessage(
          this.getPasswordErrorMessage()
        );
      }
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.login();
  }

  private login(): void {
    this.isLoading = true;
    
    const { email, password } = this.loginForm.value;

    this.authUseCase.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          this.isLoading = false;
          
          if (success) {
            this.notificationService.showToastSuccessMessage(
              'Inicio de sesión exitoso'
            );
            
            setTimeout(() => {
              this.router.navigate(['/users/list']);
            }, 300);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.handleLoginError(error);
        }
      });
  }

  private handleLoginError(error: any): void {
    let errorMessage = 'Error al iniciar sesión';

    if (error.status === 401 || error.status === 400) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 429) {
      errorMessage = 'Demasiados intentos. Espere un momento.';
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor. Intente más tarde.';
    }
    
    this.notificationService.showToastErrorMessage(errorMessage);
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    
    if (emailControl?.hasError('required')) {
      return 'El correo es requerido';
    }
    
    if (emailControl?.hasError('email')) {
      return 'Ingrese un correo válido';
    }
    
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    
    if (passwordControl?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    
    if (passwordControl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get canSubmit(): boolean {
    return this.loginForm.valid && !this.isLoading;
  }
}
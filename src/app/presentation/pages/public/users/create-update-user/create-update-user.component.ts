import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCard, MatCardContent } from '@angular/material/card';
import { UserUseCase } from 'src/app/infrastructure/use-cases/app/user.usecase';
import { UserMapDataListDTO, CreateUserDTO, UpdateUserDTO } from 'src/app/core/data-transfer-object/App/user.dto';
import { NotificationsService } from 'src/src/app/services/notifications.service';

interface DialogData {
    user?: UserMapDataListDTO | null;
    isEdit: boolean;
}

@Component({
    selector: 'app-create-update-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatCard,
        MatCardContent,
    ],
    templateUrl: './create-update-user.component.html',
    styleUrls: ['./create-update-user.component.scss'],
})
export class CreateUpdateUserComponent implements OnInit {
    userForm: FormGroup;
    isEdit: boolean = false;
    isLoading: boolean = false;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    constructor(
        public _dialogRef: MatDialogRef<CreateUpdateUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _notificationsService: NotificationsService,
        private _userUseCase: UserUseCase
    ) {
        this.isEdit = this.data?.isEdit || false;
        this.userForm = this.createUserForm();
    }

    ngOnInit(): void {
        if (this.isEdit && this.data?.user) {
            this.populateForm(this.data.user);
        }
    }

    private createUserForm(): FormGroup {
        if (!this.isEdit) {
            return this._formBuilder.group({
                nameUser: [
                    '',
                    [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
                ],
                emailUser: [
                    '',
                    [Validators.required, Validators.email, Validators.maxLength(100)]
                ],
                phoneUser: [
                    '',
                    [Validators.maxLength(20)]
                ],
                specialitiesUser: [
                    '',
                    [Validators.maxLength(255)]
                ],
                password: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(100)]
                ],
                confirmPassword: [
                    '',
                    [Validators.required]
                ]
            }, { validators: this.passwordMatchValidator });
        } else {
            return this._formBuilder.group({
                nameUser: [
                    '',
                    [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
                ],
                emailUser: [
                    '',
                    [Validators.required, Validators.email, Validators.maxLength(100)]
                ],
                phoneUser: [
                    '',
                    [Validators.maxLength(20)]
                ],
                specialitiesUser: [
                    '',
                    [Validators.maxLength(255)]
                ],
                isActiveUser: [true, Validators.required]
            });
        }
    }

    private passwordMatchValidator(control: any) {
        if (!control || !control.get) return null;
        
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        
        if (password && confirmPassword && password !== confirmPassword) {
            control.get('confirmPassword')?.setErrors({ mismatch: true });
            return { mismatch: true };
        }
        
        return null;
    }

    private populateForm(user: UserMapDataListDTO): void {
        this.userForm.patchValue({
            nameUser: user.nameUser,
            emailUser: user.emailUser,
            phoneUser: user.phoneUser || '',
            specialitiesUser: user.specialitiesUser || '',
            isActiveUser: user.isActiveUser
        });
    }

    close(): void {
        this._dialogRef.close(false);
    }

    submit(): void {
        if (this.userForm.valid) {
            this.isLoading = true;
            const formValue = this.userForm.value;

            if (this.isEdit) {
                this.updateUser(formValue);
            } else {
                this.createUser(formValue);
            }
        } else {
            this.markFormGroupTouched();
            this._notificationsService.showToastErrorMessage(
                'Por favor complete todos los campos requeridos correctamente.'
            );
        }
    }

    private createUser(formValue: any): void {
        const createDto: CreateUserDTO = {
            nameUser: formValue.nameUser.trim(),
            emailUser: formValue.emailUser.trim().toLowerCase(),
            phoneUser: formValue.phoneUser?.trim() || undefined,
            specialitiesUser: formValue.specialitiesUser?.trim() || undefined,
            passwordHashUser: formValue.password
        };

        this._userUseCase.CreateUser(createDto).subscribe({
            next: (success) => {
                this.isLoading = false;
                if (success) {
                    this._dialogRef.close(true);
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error creating user:', error);
                this._notificationsService.showToastErrorMessage(
                    'Error al crear el usuario. Por favor inténtelo nuevamente.'
                );
            },
        });
    }

    private updateUser(formValue: any): void {
        if (!this.data?.user?.userId) {
            this._notificationsService.showToastErrorMessage(
                'Error: ID de usuario no válido'
            );
            this.isLoading = false;
            return;
        }

        const updateDto: UpdateUserDTO = {
            userId: this.data.user.userId,
            nameUser: formValue.nameUser.trim(),
            emailUser: formValue.emailUser.trim().toLowerCase(),
            phoneUser: formValue.phoneUser?.trim() || undefined,
            specialitiesUser: formValue.specialitiesUser?.trim() || undefined,
            isActiveUser: formValue.isActiveUser
        };

        this._userUseCase.UpdateUser(updateDto).subscribe({
            next: (success) => {
                this.isLoading = false;
                if (success) {
                    this._dialogRef.close(true);
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error updating user:', error);
                this._notificationsService.showToastErrorMessage(
                    'Error al actualizar el usuario. Por favor inténtelo nuevamente.'
                );
            },
        });
    }

    private markFormGroupTouched(): void {
        Object.keys(this.userForm.controls).forEach((key) => {
            const control = this.userForm.get(key);
            control?.markAsTouched();
        });
    }

    getDialogTitle(): string {
        return this.isEdit ? 'Editar Usuario' : 'Crear Usuario';
    }

    getSubmitButtonText(): string {
        return this.isEdit ? 'Actualizar' : 'Crear Usuario';
    }

    hasError(fieldName: string, errorType: string): boolean {
        const field = this.userForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    getErrorMessage(fieldName: string): string {
        const field = this.userForm.get(fieldName);

        if (field?.hasError('required')) {
            return `${this.getFieldDisplayName(fieldName)} es requerido`;
        }

        if (field?.hasError('email')) {
            return 'Ingrese un email válido';
        }

        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength']?.requiredLength;
            return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${minLength} caracteres`;
        }

        if (field?.hasError('maxlength')) {
            const maxLength = field.errors?.['maxlength']?.requiredLength;
            return `${this.getFieldDisplayName(fieldName)} no puede exceder ${maxLength} caracteres`;
        }

        if (field?.hasError('mismatch')) {
            return 'Las contraseñas no coinciden';
        }

        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const fieldNames: { [key: string]: string } = {
            nameUser: 'Nombre completo',
            emailUser: 'Email',
            phoneUser: 'Teléfono',
            specialitiesUser: 'Especialidades',
            password: 'Contraseña',
            confirmPassword: 'Confirmar contraseña',
            isActiveUser: 'Estado'
        };

        return fieldNames[fieldName] || fieldName;
    }

    isEmailValid(): boolean {
        const email = this.userForm.get('emailUser')?.value;
        if (!email) return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isNameValid(): boolean {
        const name = this.userForm.get('nameUser')?.value;
        if (!name || name.trim() === '') return false;
        
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        return nameRegex.test(name.trim());
    }

    isPhoneValid(): boolean {
        const phone = this.userForm.get('phoneUser')?.value;
        if (!phone || phone.trim() === '') return true; 
        
        const phoneRegex = /^[+]?[\d\s\-()]+$/;
        return phoneRegex.test(phone.trim());
    }

    generateRandomPassword(): void {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        this.userForm.patchValue({
            password: password,
            confirmPassword: password
        });

        this.showPassword = true;
        this.showConfirmPassword = true;
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    copyPasswordToClipboard(): void {
        const password = this.userForm.get('password')?.value;
        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                this._notificationsService.showToastSuccessMessage('Contraseña copiada al portapapeles');
            }).catch(() => {
                this._notificationsService.showToastErrorMessage('Error al copiar la contraseña');
            });
        }
    }
}
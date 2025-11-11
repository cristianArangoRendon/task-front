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
import { TaskUseCase } from 'src/app/infrastructure/use-cases/app/task.usecase';
import {
    TaskMapDataDTO,
    CreateTaskDTO,
    UpdateTaskDTO,
} from 'src/app/core/data-transfer-object/App/task.dto';
import { NotificationsService } from 'src/src/app/services/notifications.service';
import { UserUseCase } from 'src/app/infrastructure/use-cases/app/user.usecase';
import { UserMapDataListDTO } from 'src/app/core/data-transfer-object/App/user.dto';

interface DialogData {
    task?: TaskMapDataDTO | null;
    isEdit: boolean;
}

@Component({
    selector: 'app-create-update-task',
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
    templateUrl: './create.update-tasks.component.html',
    styleUrls: ['./create.update-tasks.component.scss'],
})
export class CreateUpdateTaskComponent implements OnInit {
    taskForm: FormGroup;
    isEdit: boolean = false;
    isLoading: boolean = false;
    loadingUsers: boolean = false;
    users: UserMapDataListDTO[] = [];

    taskStatuses = [
        { id: 1, name: 'Pendiente', icon: 'radio_button_unchecked' },
        { id: 3, name: 'Completada', icon: 'check_circle' },
    ];

    constructor(
        public _dialogRef: MatDialogRef<CreateUpdateTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _notificationsService: NotificationsService,
        private _taskUseCase: TaskUseCase,
        private _userUseCase: UserUseCase
    ) {
        this.isEdit = this.data?.isEdit || false;
        this.taskForm = this.createTaskForm();
    }

    ngOnInit(): void {
        this.loadUsers();

        if (this.isEdit && this.data?.task) {
            this.populateForm(this.data.task);
        }
    }

    private createTaskForm(): FormGroup {
        return this._formBuilder.group({
            titleTask: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(200),
                ],
            ],
            descriptionTask: ['', [Validators.maxLength(1000)]],
            taskStatusId: [1, [Validators.required]],
        });
    }

    private loadUsers(): void {
        this.loadingUsers = true;

        this._userUseCase.GetActiveUsers().subscribe({
            next: (response) => {
                this.users = response.results || [];
                this.loadingUsers = false;
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.loadingUsers = false;
                this._notificationsService.showToastErrorMessage(
                    'Error al cargar los usuarios'
                );
            },
        });
    }

    private populateForm(task: TaskMapDataDTO): void {
        this.taskForm.patchValue({
            titleTask: task.titleTask,
            descriptionTask: task.descriptionTask || '',
            taskStatusId: task.taskStatusId,
        });
    }

    close(): void {
        this._dialogRef.close(false);
    }

    submit(): void {
        if (this.taskForm.valid) {
            this.isLoading = true;
            const formValue = this.taskForm.value;

            if (this.isEdit) {
                this.updateTask(formValue);
            } else {
                this.createTask(formValue);
            }
        } else {
            this.markFormGroupTouched();
            this._notificationsService.showToastErrorMessage(
                'Por favor complete todos los campos requeridos correctamente.'
            );
        }
    }

    private createTask(formValue: any): void {
        const createDto: CreateTaskDTO = {
            titleTask: formValue.titleTask.trim(),
            descriptionTask: formValue.descriptionTask?.trim() || undefined,
            taskStatusId: formValue.taskStatusId,
        };

        this._taskUseCase.CreateTask(createDto).subscribe({
            next: (success) => {
                this.isLoading = false;
                if (success) {
                    this._dialogRef.close(true);
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error creating task:', error);
                this._notificationsService.showToastErrorMessage(
                    'Error al crear la tarea. Por favor inténtelo nuevamente.'
                );
            },
        });
    }

    private updateTask(formValue: any): void {
        if (!this.data?.task?.taskId) {
            this._notificationsService.showToastErrorMessage(
                'Error: ID de tarea no válido'
            );
            this.isLoading = false;
            return;
        }

        const updateDto: UpdateTaskDTO = {
            taskId: this.data.task.taskId,
            titleTask: formValue.titleTask.trim(),
            descriptionTask: formValue.descriptionTask?.trim() || undefined,
            taskStatusId: formValue.taskStatusId,
        };

        this._taskUseCase.UpdateTask(updateDto).subscribe({
            next: (success) => {
                this.isLoading = false;
                if (success) {
                    this._dialogRef.close(true);
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error updating task:', error);
                this._notificationsService.showToastErrorMessage(
                    'Error al actualizar la tarea. Por favor inténtelo nuevamente.'
                );
            },
        });
    }

    private markFormGroupTouched(): void {
        Object.keys(this.taskForm.controls).forEach((key) => {
            const control = this.taskForm.get(key);
            control?.markAsTouched();
        });
    }

    getDialogTitle(): string {
        return this.isEdit ? 'Editar Tarea' : 'Crear Tarea';
    }

    getSubmitButtonText(): string {
        return this.isEdit ? 'Actualizar' : 'Crear Tarea';
    }

    hasError(fieldName: string, errorType: string): boolean {
        const field = this.taskForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    getErrorMessage(fieldName: string): string {
        const field = this.taskForm.get(fieldName);

        if (field?.hasError('required')) {
            return `${this.getFieldDisplayName(fieldName)} es requerido`;
        }

        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength']?.requiredLength;
            return `${this.getFieldDisplayName(
                fieldName
            )} debe tener al menos ${minLength} caracteres`;
        }

        if (field?.hasError('maxlength')) {
            const maxLength = field.errors?.['maxlength']?.requiredLength;
            return `${this.getFieldDisplayName(
                fieldName
            )} no puede exceder ${maxLength} caracteres`;
        }

        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const fieldNames: { [key: string]: string } = {
            titleTask: 'Título',
            descriptionTask: 'Descripción',
            taskStatusId: 'Estado',
            userId: 'Usuario asignado',
        };

        return fieldNames[fieldName] || fieldName;
    }

    isTitleValid(): boolean {
        const title = this.taskForm.get('titleTask')?.value;
        if (!title || title.trim() === '') return false;

        return title.trim().length >= 3;
    }

    getUserDisplayName(user: UserMapDataListDTO): string {
        return user.nameUser;
    }

    getStatusIcon(statusId: number): string {
        const status = this.taskStatuses.find((s) => s.id === statusId);
        return status?.icon || 'radio_button_unchecked';
    }

    getCharacterCount(fieldName: string, maxLength: number): string {
        const value = this.taskForm.get(fieldName)?.value || '';
        return `${value.length}/${maxLength}`;
    }
}

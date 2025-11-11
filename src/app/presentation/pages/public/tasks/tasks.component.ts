import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms';
import { TableResultDTO } from 'src/app/core/data-transfer-object/common/table-result/table-result.dto';
import { TaskUseCase } from 'src/app/infrastructure/use-cases/app/task.usecase';
import {
    TaskMapDataDTO,
    GetFilterTasksDTO,
} from 'src/app/core/data-transfer-object/App/task.dto';
import { LoadingComponent } from 'src/app/_layout/common/loading/loading/loading.component';
import { CreateUpdateTaskComponent } from './create.update-tasks/create.update-tasks.component';
// import { CreateUpdateTaskComponent } from './create-update-task/create-update-task.component';

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        LoadingComponent,
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, AfterViewInit {
    isLoading = true;
    tasks: TaskMapDataDTO[] = [];
    totalRecords: number = 0;
    dataSource = new MatTableDataSource<TaskMapDataDTO>([]);
    currentPage: number = 1;
    pageSize: number = 6;

    filterForm: FormGroup;

    @ViewChild(MatPaginator) paginatorRef: MatPaginator;

    taskStatuses = [
        { id: 1, name: 'Pendiente' },
        { id: 2, name: 'Completada' },
    ];

    constructor(
        private _taskUseCase: TaskUseCase,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
        this.filterForm = this.createFilterForm();
    }

    ngOnInit(): void {
        this.loadTasksData();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginatorRef;
    }

    private createFilterForm(): FormGroup {
        return this.fb.group({
            taskStatusId: [3],
            isCompleted: [null],
            searchTerm: [''],
        });
    }

    loadTasksData(): void {
        this.isLoading = true;
        const filters = this.filterForm.value;

        const filterParams: GetFilterTasksDTO = {
            pageNumber: this.currentPage,
            pageSize: this.pageSize,
        };

        if (
            filters.taskStatusId !== null &&
            filters.taskStatusId !== undefined
        ) {
            filterParams.taskStatusId = filters.taskStatusId;
        }

        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
            filterParams.searchTerm = filters.searchTerm.trim();
        }

        this._taskUseCase.GetListTasks(filterParams).subscribe({
            next: (response: TableResultDTO) => {
                this.tasks = response.results || [];
                this.dataSource.data = this.tasks;
                this.totalRecords = response.totalRecords || 0;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.showErrorMessage('Error al cargar las tareas');
                console.error('Error loading tasks:', error);
            },
        });
    }

    getTotalPages(): number {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    onPageChange(): void {
        if (this.currentPage < 1) {
            this.currentPage = 1;
        } else if (this.currentPage > this.getTotalPages()) {
            this.currentPage = this.getTotalPages();
        }
        this.loadTasksData();
    }

    onPageSizeChange(): void {
        this.currentPage = 1;
        this.loadTasksData();
    }

    handlePageEvent(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.loadTasksData();
    }

    applyFilters(): void {
        this.currentPage = 1;
        this.loadTasksData();
    }

    clearFilters(): void {
        this.filterForm.reset();
        this.filterForm.patchValue({
            taskStatusId: 3,
            searchTerm: '',
        });
        this.currentPage = 1;
        this.loadTasksData();
    }

    addNewTask(): void {
        const dialogRef = this.dialog.open(CreateUpdateTaskComponent, {
            width: '1200px',
            maxWidth: '95vw',
            disableClose: true,
            data: {
                task: null,
                isEdit: false,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadTasksData();
                this.showSuccessMessage('Tarea creada correctamente');
            }
        });

        this.showSuccessMessage(
            'Función de crear tarea pendiente de implementar'
        );
    }

    editTask(task: TaskMapDataDTO): void {
        const dialogRef = this.dialog.open(CreateUpdateTaskComponent, {
            width: '1200px',
            maxWidth: '95vw',
            disableClose: true,
            data: {
                task: task,
                isEdit: true,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadTasksData();
                this.showSuccessMessage('Tarea actualizada correctamente');
            }
        });
        console.log('Editar tarea:', task);
        this.showSuccessMessage(
            'Función de editar tarea pendiente de implementar'
        );
    }

    deleteTask(task: TaskMapDataDTO): void {
        if (
            confirm(
                `¿Está seguro de que desea eliminar la tarea "${task.titleTask}"?`
            )
        ) {
            this.isLoading = true;

            this._taskUseCase.DeleteTask(task.taskId).subscribe({
                next: (success) => {
                    if (success) {
                        this.loadTasksData();
                        this.showSuccessMessage(
                            'Tarea eliminada correctamente'
                        );
                    } else {
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.showErrorMessage('Error al eliminar la tarea');
                    console.error('Error deleting task:', error);
                },
            });
        }
    }

    toggleTaskCompletion(task: TaskMapDataDTO): void {
        this.isLoading = true;

        const newStatusId = task.taskStatusId === 1 ? 2 : 1;

        this._taskUseCase
            .UpdateTask({
                taskId: task.taskId,
                taskStatusId: newStatusId,
            })
            .subscribe({
                next: (success) => {
                    if (success) {
                        this.loadTasksData();
                        this.showSuccessMessage(
                            newStatusId === 2
                                ? 'Tarea completada'
                                : 'Tarea marcada como pendiente'
                        );
                    } else {
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.showErrorMessage(
                        'Error al actualizar el estado de la tarea'
                    );
                    console.error('Error updating task status:', error);
                },
            });
    }

    refreshData(): void {
        this.loadTasksData();
    }

    getTaskStatusClass(task: TaskMapDataDTO): string {
        if (task.isCompleted) return 'status-completed';
        if (task.taskStatusId === 2) return 'status-in-progress';
        return 'status-pending';
    }

    getTaskStatusText(task: TaskMapDataDTO): string {
        return task.nameTaskStatus || 'Sin estado';
    }

    getTaskStatusIcon(task: TaskMapDataDTO): string {
        if (task.isCompleted) return 'check_circle';
        if (task.taskStatusId === 2) return 'pending';
        return 'radio_button_unchecked';
    }

    getFormattedDate(date: Date | string | null | undefined): string {
        if (!date) return 'N/A';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'N/A';
        }
    }

    trackByTaskId(index: number, task: TaskMapDataDTO): number {
        return task.taskId;
    }

    getStartRecord(): number {
        if (this.totalRecords === 0) return 0;
        return (this.currentPage - 1) * this.pageSize + 1;
    }

    getEndRecord(): number {
        const end = this.currentPage * this.pageSize;
        return end > this.totalRecords ? this.totalRecords : end;
    }

    private showSuccessMessage(message: string): void {
        this._snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
        });
    }

    private showErrorMessage(message: string): void {
        this._snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
        });
    }
}

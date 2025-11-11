import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from 'src/app/_layout/common/loading/loading/loading.component';
import { TaskUseCase } from 'src/app/infrastructure/use-cases/app/task.usecase';
import { GetTaskMetricsDTO } from 'src/app/core/data-transfer-object/App/task.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  metrics: GetTaskMetricsDTO | null = null;
  error: string = '';

  constructor(
    private taskUseCase: TaskUseCase,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.isLoading = true;
    this.error = '';

    this.taskUseCase.GetTaskMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las métricas';
        this.isLoading = false;
        this.showErrorMessage('Error al cargar las métricas del dashboard');
        console.error('Error loading metrics:', error);
      }
    });
  }

  refreshMetrics(): void {
    this.loadMetrics();
    this.showSuccessMessage('Métricas actualizadas');
  }

  private showSuccessMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
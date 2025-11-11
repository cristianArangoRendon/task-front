import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { TaskService } from '../../services/app/task.service';
import { TableResultDTO } from 'src/app/core/data-transfer-object/common/table-result/table-result.dto';
import { CreateTaskDTO, UpdateTaskDTO, GetFilterTasksDTO, GetTaskMetricsDTO, TaskMapDataByIdDTO } from 'src/app/core/data-transfer-object/App/task.dto';
import { NotificationsService } from 'src/src/app/services/notifications.service';



@Injectable({
  providedIn: 'root',
})
export class TaskUseCase {
  constructor(
    private _taskService: TaskService,
    private _notificationService: NotificationsService,
  ) {}

  GetListTasks(
    filters?: GetFilterTasksDTO
  ): Observable<TableResultDTO> {
    return this._taskService.GetListTasks(filters).pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
        }
        return response.data;
      })
    );
  }

  GetTaskMetrics(): Observable<GetTaskMetricsDTO | null> {
    return this._taskService.GetTaskMetrics().pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
          return null;
        }
        return response.data as GetTaskMetricsDTO;
      })
    );
  }

  CreateTask(task: CreateTaskDTO): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._taskService.CreateTask(task).subscribe({
        next: (response: ResponseDTO) => {
          if (response.isSuccess) {
            this._notificationService.showToastSuccessMessage(response.message!);
            observer.next(true);
          } else {
            this._notificationService.showToastErrorMessage(response.message!);
            observer.next(false);
          }
          observer.complete();
        },
        error: () => {
          this._notificationService.showToastErrorMessage('Error al crear la tarea');
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  UpdateTask(task: UpdateTaskDTO): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._taskService.UpdateTask(task).subscribe({
        next: (response: ResponseDTO) => {
          if (response.isSuccess) {
            this._notificationService.showToastSuccessMessage(response.message!);
            observer.next(true);
          } else {
            this._notificationService.showToastErrorMessage(response.message!);
            observer.next(false);
          }
          observer.complete();
        },
        error: () => {
          this._notificationService.showToastErrorMessage('Error al actualizar la tarea');
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  DeleteTask(taskId: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._taskService.DeleteTask(taskId).subscribe({
        next: (response: ResponseDTO) => {
          if (response.isSuccess) {
            this._notificationService.showToastSuccessMessage(response.message!);
            observer.next(true);
          } else {
            this._notificationService.showToastErrorMessage(response.message!);
            observer.next(false);
          }
          observer.complete();
        },
        error: () => {
          this._notificationService.showToastErrorMessage('Error al eliminar la tarea');
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  GetTaskById(taskId: number): Observable<TaskMapDataByIdDTO | null> {
    return this._taskService.GetTaskById(taskId).pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
          return null;
        }
        return response.data as TaskMapDataByIdDTO;
      })
    );
  }
}
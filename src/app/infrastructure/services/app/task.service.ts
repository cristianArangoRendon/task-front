import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { HttpService } from '../http-services/http.service';
import { ConfigService } from '../config/config.service';
import { PaginatorDTO } from 'src/app/core/data-transfer-object/common/paginator/paginator.dto';
import { ITaskService } from 'src/app/core/interfaces/app/ITask.service';
import { CreateTaskDTO, GetFilterTasksDTO, UpdateTaskDTO } from 'src/app/core/data-transfer-object/App/task.dto';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements ITaskService {
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService,
  ) {}

  CreateTask(task: CreateTaskDTO): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const body = {
          titleTask: task.titleTask,
          descriptionTask: task.descriptionTask,
          taskStatusId: task.taskStatusId,
        };
        return this._httpService.post(url, 'Tasks', null, body);
      })
    );
  }

  UpdateTask(task: UpdateTaskDTO): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const body = {
          taskId: task.taskId,
          titleTask: task.titleTask,
          descriptionTask: task.descriptionTask,
          taskStatusId: task.taskStatusId,
        };
        return this._httpService.put(url, `Tasks/${task.taskId}`, null, body);
      })
    );
  }

  DeleteTask(taskId: number): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => this._httpService.delete(url, `Tasks/${taskId}`))
    );
  }

  GetListTasks(
    filters?: GetFilterTasksDTO
  ): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const params: any = {};
        if (filters?.taskStatusId) params.taskStatusId = filters.taskStatusId;
        if (filters?.searchTerm) params.searchTerm = filters.searchTerm;

        return this._httpService.get(url, 'Tasks', params);
      })
    );
  }

  GetTaskById(taskId: number): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => this._httpService.get(url, `Tasks/${taskId}`, null))
    );
  }

  GetTaskMetrics(): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => this._httpService.get(url, 'Tasks/metrics', null))
    );
  }
}
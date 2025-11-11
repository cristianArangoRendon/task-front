import { Observable } from 'rxjs';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { PaginatorDTO } from 'src/app/core/data-transfer-object/common/paginator/paginator.dto';
import { CreateTaskDTO, GetFilterTasksDTO, UpdateTaskDTO } from '../../data-transfer-object/App/task.dto';

export interface ITaskService {
  CreateTask(task: CreateTaskDTO): Observable<ResponseDTO>;
  UpdateTask(task: UpdateTaskDTO): Observable<ResponseDTO>;
  DeleteTask(taskId: number): Observable<ResponseDTO>;
  GetListTasks(filters?: GetFilterTasksDTO): Observable<ResponseDTO>;
  GetTaskById(taskId: number): Observable<ResponseDTO>;
  GetTaskMetrics(): Observable<ResponseDTO>;
}

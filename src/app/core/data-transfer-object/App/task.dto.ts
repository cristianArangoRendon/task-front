export class CreateTaskDTO {
  titleTask: string = '';
  descriptionTask?: string;
  taskStatusId: number = 1; 
}

export class UpdateTaskDTO {
  taskId!: number;
  titleTask?: string;
  descriptionTask?: string;
  taskStatusId?: number; 
}

export class GetFilterTasksDTO {
  taskStatusId?: number; 
  searchTerm?: string;
  pageSize?: number;
  pageNumber?: number;
}

export class TaskMapDataDTO {
  taskId!: number;
  titleTask!: string;
  descriptionTask?: string;
  taskStatusId!: number; 
  createdAtTask!: string;
  updatedAtTask?: string;
  taskStatusName?: string;
  nameTaskStatus?: string;
  get isCompleted(): boolean {
    return this.taskStatusId === 2;
  }
}

export interface TaskMapDataByIdDTO {
  taskId: number;
  titleTask: string;
  descriptionTask?: string;
  taskStatusId: number;
  nameTaskStatus: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface GetTaskMetricsDTO {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
}

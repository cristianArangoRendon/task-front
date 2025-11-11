import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { UserService } from '../../services/app/user.service';
import { PaginatorDTO } from 'src/app/core/data-transfer-object/common/paginator/paginator.dto';
import { TableResultDTO } from 'src/app/core/data-transfer-object/common/table-result/table-result.dto';
import { NotificationsService } from 'src/src/app/services/notifications.service';
import { CreateUserDTO, UpdateUserDTO, UserMapDataByIdDTO } from 'src/app/core/data-transfer-object/App/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserUseCase {
  constructor(
    private _userService: UserService,
    private _notificationService: NotificationsService,
  ) {}

  GetListUsers(
    paginator?: PaginatorDTO,
    filters?: {
      nameUser?: string;
      emailUser?: string;
      phoneUser?: string;
      specialitiesUser?: string;
      isActiveUser?: boolean;
    }
  ): Observable<TableResultDTO> {
    return this._userService.GetListUsers(paginator, filters).pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
        }
        return response.data;
      })
    );
  }

  CreateUser(user: CreateUserDTO): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._userService.CreateUser(user)
        .subscribe({
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
          error: (error) => {
            this._notificationService.showToastErrorMessage('Error al crear el usuario');
            observer.next(false);
            observer.complete();
          }
        });
    });
  }

  UpdateUser(user: UpdateUserDTO): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._userService.UpdateUser(user)
        .subscribe({
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
          error: (error) => {
            this._notificationService.showToastErrorMessage('Error al actualizar el usuario');
            observer.next(false);
            observer.complete();
          }
        });
    });
  }

  DeleteUser(userId: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._userService.DeleteUser(userId)
        .subscribe({
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
          error: (error) => {
            this._notificationService.showToastErrorMessage('Error al eliminar el usuario');
            observer.next(false);
            observer.complete();
          }
        });
    });
  }

  GetUserById(userId: number): Observable<UserMapDataByIdDTO | null> {
    return this._userService.GetUserById(userId).pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
          return null;
        }
        return response.data;
      })
    );
  }

  GetUserByEmail(email: string): Observable<UserMapDataByIdDTO | null> {
    return this._userService.GetUserByEmail(email).pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
          return null;
        }
        return response.data;
      })
    );
  }

  GetUserImage(fileName: string, fileType: number): Observable<string | null> {
    return this._userService.GetUserImage(fileName, fileType).pipe(
      map((response: ResponseDTO) => {
        if (!response.isSuccess) {
          this._notificationService.showToastErrorMessage(response.message!);
          return null;
        }
        return response.data;
      })
    );
  }

  // Métodos auxiliares actualizados
  GetActiveUsers(paginator?: PaginatorDTO): Observable<TableResultDTO> {
    return this.GetListUsers(paginator, { isActiveUser: true });
  }

  SearchUsersByName(nameUser: string, paginator?: PaginatorDTO): Observable<TableResultDTO> {
    return this.GetListUsers(paginator, { nameUser });
  }

  SearchUsersByEmail(emailUser: string, paginator?: PaginatorDTO): Observable<TableResultDTO> {
    return this.GetListUsers(paginator, { emailUser });
  }

  SearchActiveUsersByName(nameUser: string, paginator?: PaginatorDTO): Observable<TableResultDTO> {
    return this.GetListUsers(paginator, { nameUser, isActiveUser: true });
  }

  SearchUsers(
    searchTerm: string, 
    paginator?: PaginatorDTO
  ): Observable<TableResultDTO> {
    return this.GetListUsers(paginator, { 
      nameUser: searchTerm,
      emailUser: searchTerm 
    });
  }

  SearchActiveUsers(
    searchTerm: string, 
    paginator?: PaginatorDTO
  ): Observable<TableResultDTO> {
    return this.GetListUsers(paginator, { 
      nameUser: searchTerm,
      emailUser: searchTerm,
      isActiveUser: true 
    });
  }
}
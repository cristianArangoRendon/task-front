import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { HttpService } from '../http-services/http.service';
import { ConfigService } from '../config/config.service';
import { PaginatorDTO } from 'src/app/core/data-transfer-object/common/paginator/paginator.dto';
import { CreateUserDTO, UpdateUserDTO } from 'src/app/core/data-transfer-object/App/user.dto';
import { IUserService } from 'src/app/core/interfaces/app/IUser.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements IUserService {
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService,
  ) {}

  CreateUser(user: CreateUserDTO): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const body = {
          nameUser: user.nameUser,
          emailUser: user.emailUser,
          phoneUser: user.phoneUser,
          specialitiesUser: user.specialitiesUser,
          passwordHashUser: user.passwordHashUser,
          userImage: user.userImage
        };
        return this._httpService.post(url, "Users", null, body);
      })
    );
  }

  UpdateUser(user: UpdateUserDTO): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const body = {
          userId: user.userId,
          nameUser: user.nameUser,
          emailUser: user.emailUser,
          phoneUser: user.phoneUser,
          specialitiesUser: user.specialitiesUser,
          isActiveUser: user.isActiveUser,
          userImage: user.userImage
        };
        return this._httpService.put(url, `Users/${user.userId}`, null, body);
      })
    );
  }

  DeleteUser(userId: number): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        return this._httpService.delete(url, `Users/${userId}`);
      })
    );
  }

  GetListUsers(
    paginator?: PaginatorDTO,
    filters?: {
      nameUser?: string;
      emailUser?: string;
      phoneUser?: string;
      specialitiesUser?: string;
      isActiveUser?: boolean;
    }
  ): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const params: any = {};
        
        if (paginator?.pageIndex !== undefined) {
          params.pageNumber = paginator.pageIndex.toString();
        }
        if (paginator?.pageSize !== undefined) {
          params.pageSize = paginator.pageSize.toString();
        }
        
        if (filters?.nameUser) {
          params.nameUser = filters.nameUser;
        }
        if (filters?.emailUser) {
          params.emailUser = filters.emailUser;
        }
        if (filters?.phoneUser) {
          params.phoneUser = filters.phoneUser;
        }
        if (filters?.specialitiesUser) {
          params.specialitiesUser = filters.specialitiesUser;
        }
        if (filters?.isActiveUser !== undefined) {
          params.isActiveUser = filters.isActiveUser.toString();
        }
        
        return this._httpService.get(url, "Users", params);
      })
    );
  }

  GetUserById(userId: number): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        return this._httpService.get(url, `Users/${userId}`, null);
      })
    );
  }

  GetUserByEmail(email: string): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const params = {
          email: email
        };
        return this._httpService.get(url, "Users/by-email", params);
      })
    );
  }

  GetUserImage(fileName: string, fileType: number): Observable<ResponseDTO> {
    return this._configService.getUrlApplication().pipe(
      switchMap(url => {
        const params = {
          fileType: fileType.toString()
        };
        return this._httpService.get(url, `Users/images/${fileName}`, params);
      })
    );
  }
}
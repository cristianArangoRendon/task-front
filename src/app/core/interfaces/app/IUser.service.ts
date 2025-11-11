import { Observable } from 'rxjs';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { PaginatorDTO } from 'src/app/core/data-transfer-object/common/paginator/paginator.dto';
import { CreateUserDTO, UpdateUserDTO } from 'src/app/core/data-transfer-object/App/user.dto';

export interface IUserService {
  CreateUser(user: CreateUserDTO): Observable<ResponseDTO>;
  
  UpdateUser(user: UpdateUserDTO): Observable<ResponseDTO>;
  
  DeleteUser(userId: number): Observable<ResponseDTO>;

  GetListUsers(
    paginator?: PaginatorDTO,
    filters?: {
      nameUser?: string;
      emailUser?: string;
      phoneUser?: string;
      specialitiesUser?: string;
      isActiveUser?: boolean;
    }
  ): Observable<ResponseDTO>;

  GetUserById(userId: number): Observable<ResponseDTO>;

  GetUserByEmail(email: string): Observable<ResponseDTO>;

  GetUserImage(fileName: string, fileType: number): Observable<ResponseDTO>;
}
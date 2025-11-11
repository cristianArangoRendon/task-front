import { Observable } from "rxjs";
import { ResponseDTO } from "../../data-transfer-object/common/response/response.dto";

export interface IAuthService {
    login(userName : string, password : string, applicationId:number): Observable<ResponseDTO>;
}

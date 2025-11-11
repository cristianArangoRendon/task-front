import { Observable } from "rxjs";
import { ResponseDTO } from "../../data-transfer-object/common/response/response.dto";

export interface IModulesMenusServices {
    getAccessibleModulesAndMenus(applicationId:number,userId:number):Observable<ResponseDTO>
}

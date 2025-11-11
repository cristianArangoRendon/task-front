import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { IModulesMenusServices } from 'src/app/core/interfaces/config/Imodules-menus.service';
import { ResponseDTO } from 'src/app/core/data-transfer-object/common/response/response.dto';
import { HttpService } from '../http-services/http.service';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})

export class ModulesMenusServices implements IModulesMenusServices {


    constructor(private _httpService: HttpService, private _configService: ConfigService
    ) {}

    getAccessibleModulesAndMenus(applicationId: number, userId: number): Observable<ResponseDTO> {
        return this._configService.getUrlTransversalLayer().pipe(
            switchMap(url => {
                const params = { applicationId, userId };
                return this._httpService.get(url, "GetAccessibleModulesAndMenus", params);
            })
        );
    }

}

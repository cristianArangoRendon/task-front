import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IConfigService } from 'src/app/core/interfaces/config/Iconfig.service'; 
import { AppConfig } from 'src/app/core/data-transfer-object/common/app-config/app-config.dto';

@Injectable({
  providedIn: 'root'
})

export class ConfigService implements IConfigService {

  private configUrl = 'config.json';

  constructor(private http: HttpClient) {
  }

  getConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>(this.configUrl);
  }


  getUrlApplication(): Observable<string> {
    return this.getConfig().pipe(
      map(config => config.API_URL_application)
    );
  }


}

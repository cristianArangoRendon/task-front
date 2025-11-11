import { Observable } from "rxjs";
import { AppConfig } from "../../data-transfer-object/common/app-config/app-config.dto";

export interface IConfigService {
  getConfig(): Observable<AppConfig>;
}

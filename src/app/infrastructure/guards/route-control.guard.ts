import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ModulesMenusServices } from 'src/app/infrastructure/services/config/modules-menus.service';
import { JwtDecoderHelper } from 'src/app/infrastructure/helpers/decodec-token.helper';
import { map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouteControlGuard implements CanActivate {
  constructor(
    private modulesMenusServices: ModulesMenusServices,
    private jwtDecoderHelper: JwtDecoderHelper,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): import('rxjs').Observable<boolean> {
    const applicationId: number = parseInt(localStorage.getItem('applicationId') ?? '0');
    const userData = this.jwtDecoderHelper.getDecodedAccessToken(localStorage.getItem('authToken') ?? '');
    const userId: number = parseInt(userData.UserId);

    if (next.routeConfig?.path === 'authentication/login') {
      this.router.navigate(['authentication/login']);
      return of(false);
    }

    return this.modulesMenusServices.getAccessibleModulesAndMenus(applicationId, userId).pipe(
      map((response) => {
        const menuData = response.data;
        const hasAccess = menuData.some((module: any) =>
          module.menus.some((menu: any) => menu.controller +'/'+menu.view === next.routeConfig?.path?.split("/:")[0])
        );
        if(!hasAccess){
          menuData.some((module: any) =>
            module.menus.some((menu: any) => this.router.navigate([menu.controller +'/'+menu.view]))
          );
          return of(false);
        }
        return hasAccess;
      }),
      catchError(() => {
        this.router.navigate(['/error-500']);
        return of(false);
      })
    );
  }
}

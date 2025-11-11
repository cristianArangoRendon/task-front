import {
    Component,
    HostListener,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { ToggleService } from './toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { JwtDecoderHelper } from 'src/app/infrastructure/helpers/decodec-token.helper';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/infrastructure/services/config/shared-service.service';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    isSticky: boolean = false;
    rolDescription: string = '';
    userName: string = '';
    isToggled = false;

    notificationsCount: number = 0;
    isLoadingNotifications: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private lastToken: string | null = null;
    private notificationRefreshInterval = 60000;



    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private _jwtDecoderHelper: JwtDecoderHelper,
        private router: Router,
        private _sharedService: SharedService,
        private cdr: ChangeDetectorRef,
    ) {
        this.initializeSubscriptions();
    }

    ngOnInit(): void {
        this.loadDataUser();
        this.startTokenWatcher();

        window.addEventListener('focus', () => {
            this.checkTokenAndUpdate();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        window.removeEventListener('focus', () => {
            this.checkTokenAndUpdate();
        });
    }

    private initializeSubscriptions(): void {
        this.subscriptions.add(
            this.toggleService.isToggled$.subscribe((isToggled) => {
                this.isToggled = isToggled;
            })
        );

        this.subscriptions.add(
            this._sharedService.success$.subscribe((success) => {
                if (success) {
                    setTimeout(() => {
                        this.loadDataUser();
                        this._sharedService.setSuccess(false);
                    }, 300);
                }
            })
        );
    }

    private startTokenWatcher(): void {
        this.subscriptions.add(
            interval(2000).subscribe(() => {
                this.checkTokenAndUpdate();
            })
        );
    }



    private checkTokenAndUpdate(): void {
        const currentToken = localStorage.getItem('authToken');

        if (currentToken !== this.lastToken) {
            this.lastToken = currentToken;
            this.loadDataUser();
        }
    }

  loadDataUser(): void {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            this.clearUserData();
            return;
        }

        const userData = this._jwtDecoderHelper.getDecodedAccessToken(token);

        if (userData && userData.UserName) {
            this.rolDescription = userData.Specialities || 'Usuario';
            this.userName = userData.UserName;

            this.cdr.markForCheck();
            this.cdr.detectChanges();
        } else {
            this.clearUserData();
        }
    } catch (error) {
        this.clearUserData();
        localStorage.removeItem('authToken');
    }
}

    private clearUserData(): void {
        if (this.rolDescription || this.userName) {
            this.rolDescription = '';
            this.userName = '';
            this.cdr.detectChanges();
        }
    }

  

    viewAllNotifications(): void {
        this.router.navigate(['/inventory'], {
            queryParams: {
                lowStock: true
            }
        });
    }

    getTimeAgo(date: Date | string): string {
        if (!date) return 'Hace un momento';

        const now = new Date();
        const notificationDate = new Date(date);
        const diffMs = now.getTime() - notificationDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
        if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
        
        return notificationDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    public forceUpdate(): void {
        this.loadDataUser();
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    logout(): void {
        this.clearUserData();
        this.notificationsCount = 0;
        localStorage.clear();
        this.lastToken = null;
        this.router.navigate(['authentication/login']);
    }

    getInitials(name: string): string {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    }
}
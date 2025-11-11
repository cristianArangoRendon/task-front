import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomizerSettingsService {

    private isDarkTheme: boolean;
    private isSidebarDarkTheme: boolean;
    private isRightSidebarTheme: boolean;
    private isHideSidebarTheme: boolean;
    private isHeaderDarkTheme: boolean;
    private isCardBorderTheme: boolean;
    private isCardBorderRadiusTheme: boolean;
    private isRTLEnabledTheme: boolean;
    
    private desktopRightSidebarPreference: boolean;
    private isMobileForced: boolean = false;

    constructor() {
        this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme')!) || false;
        this.isSidebarDarkTheme = JSON.parse(localStorage.getItem('isSidebarDarkTheme')!) || false;
        this.isRightSidebarTheme = JSON.parse(localStorage.getItem('isRightSidebarTheme')!) || false;
        this.isHideSidebarTheme = JSON.parse(localStorage.getItem('isHideSidebarTheme')!) || false;
        this.isHeaderDarkTheme = JSON.parse(localStorage.getItem('isHeaderDarkTheme')!) || false;
        this.isCardBorderTheme = JSON.parse(localStorage.getItem('isCardBorderTheme')!) || false;
        this.isCardBorderRadiusTheme = JSON.parse(localStorage.getItem('isCardBorderRadiusTheme')!) || false;
        this.isRTLEnabledTheme = JSON.parse(localStorage.getItem('isRTLEnabledTheme')!) || false;
        
        this.desktopRightSidebarPreference = JSON.parse(localStorage.getItem('desktopRightSidebarPreference')!) || false;
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    }

    toggleSidebarTheme() {
        this.isSidebarDarkTheme = !this.isSidebarDarkTheme;
        localStorage.setItem('isSidebarDarkTheme', JSON.stringify(this.isSidebarDarkTheme));
    }

    toggleRightSidebarTheme() {
        if (!this.isMobileForced) {
            this.isRightSidebarTheme = !this.isRightSidebarTheme;
            this.desktopRightSidebarPreference = this.isRightSidebarTheme;
            localStorage.setItem('isRightSidebarTheme', JSON.stringify(this.isRightSidebarTheme));
            localStorage.setItem('desktopRightSidebarPreference', JSON.stringify(this.desktopRightSidebarPreference));
        }
    }


    setRightSidebarForMobile(isMobile: boolean) {
        this.isMobileForced = isMobile;
        
        if (isMobile) {
            this.isRightSidebarTheme = true;
            localStorage.setItem('isRightSidebarTheme', JSON.stringify(this.isRightSidebarTheme));
        } else {
            this.isRightSidebarTheme = this.desktopRightSidebarPreference;
            localStorage.setItem('isRightSidebarTheme', JSON.stringify(this.isRightSidebarTheme));
        }
    }

    toggleHideSidebarTheme() {
        this.isHideSidebarTheme = !this.isHideSidebarTheme;
        localStorage.setItem('isHideSidebarTheme', JSON.stringify(this.isHideSidebarTheme));
    }

    toggleHeaderTheme() {
        this.isHeaderDarkTheme = !this.isHeaderDarkTheme;
        localStorage.setItem('isHeaderDarkTheme', JSON.stringify(this.isHeaderDarkTheme));
    }

    toggleCardBorderTheme() {
        this.isCardBorderTheme = !this.isCardBorderTheme;
        localStorage.setItem('isCardBorderTheme', JSON.stringify(this.isCardBorderTheme));
    }

    toggleCardBorderRadiusTheme() {
        this.isCardBorderRadiusTheme = !this.isCardBorderRadiusTheme;
        localStorage.setItem('isCardBorderRadiusTheme', JSON.stringify(this.isCardBorderRadiusTheme));
    }

    toggleRTLEnabledTheme() {
        this.isRTLEnabledTheme = !this.isRTLEnabledTheme;
        localStorage.setItem('isRTLEnabledTheme', JSON.stringify(this.isRTLEnabledTheme));
    }

    isDark() {
        return this.isDarkTheme;
    }

    isSidebarDark() {
        return this.isSidebarDarkTheme;
    }

    isRightSidebar() {
        return this.isRightSidebarTheme;
    }

    isHideSidebar() {
        return this.isHideSidebarTheme;
    }

    isHeaderDark() {
        return this.isHeaderDarkTheme;
    }

    isCardBorder() {
        return this.isCardBorderTheme;
    }

    isCardBorderRadius() {
        return this.isCardBorderRadiusTheme;
    }

    isRTLEnabled() {
        return this.isRTLEnabledTheme;
    }

    isMobileForcedRightSidebar() {
        return this.isMobileForced && this.isRightSidebarTheme;
    }

    private isToggled = new BehaviorSubject<boolean>(false);

    get isToggled$() {
        return this.isToggled.asObservable();
    }

    toggle() {
        this.isToggled.next(!this.isToggled.value);
    }
}
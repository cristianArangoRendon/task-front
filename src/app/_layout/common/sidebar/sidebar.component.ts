import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ToggleService } from '../header/toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { MenuItemDTO } from 'src/app/core/data-transfer-object/common/sidebar/MenuItem.dto';

interface ExtendedMenuItemDTO extends MenuItemDTO {
    expanded?: boolean;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    
    logoPath = 'assets/img/logo.png';
    panelOpenState = false;
    isToggled = false;
    isMobile = false;
    private isProcessingClick = false;
    
    menuData: ExtendedMenuItemDTO[] = [
        {
            icon: 'group',
            moduleDescription: 'Usuarios',
            expanded: false,
            menus: [
                {
                    description: 'Gestión de Usuarios',
                    controller: 'users',
                    view: 'list',
                    isVisible: true,
                },
            ],
        },
        {
            icon: 'task',
            moduleDescription: 'Tareas',
            expanded: false,
            menus: [
                {
                    description: 'Gestión de tareas',
                    controller: 'tasks',
                    view: 'list',
                    isVisible: true,
                },
            ],
        },
           {
            icon: 'dashboard',
            moduleDescription: 'Reportes',
            expanded: false,
            menus: [
                {
                    description: 'Reportes  de Tareas',
                    controller: 'dashboard',
                    view: 'list',
                    isVisible: true,
                },
            ],
        },
    ];

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService
    ) {
        this.toggleService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.checkIfMobile();
        this.handleInitialSidebarPosition();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    checkIfMobile(): void {
        this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    private handleInitialSidebarPosition(): void {
        if (this.isMobile) {
            this.themeService.setRightSidebarForMobile(true);
            this.isToggled = true;
        } else {
            this.themeService.setRightSidebarForMobile(false);
            this.isToggled = false;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        const wasMobile = this.isMobile;
        this.checkIfMobile();
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.themeService.setRightSidebarForMobile(true);
                this.isToggled = true;
            } else {
                this.themeService.setRightSidebarForMobile(false);
                this.isToggled = false;
            }
        }
    }

    toggleMenu(index: number): void {
        if (!this.isMobile || this.isProcessingClick) return;
        
        this.isProcessingClick = true;
        
        setTimeout(() => {
            if (this.menuData[index]) {
                this.menuData[index].expanded = !this.menuData[index].expanded;
            }
            this.isProcessingClick = false;
        }, 50);
    }

    onMenuHeaderClick(event: Event, index: number): void {
        if (!this.isMobile) return;
        
        event.preventDefault();
        event.stopPropagation();
        this.toggleMenu(index);
    }

    onSubmenuClick(event: Event): void {
        if (this.isMobile && !this.isToggled) {
            setTimeout(() => {
                this.toggle();
            }, 100);
        }
    }

    toggle(): void {
        this.toggleService.toggle();
    }

    isMenuExpanded(index: number): boolean {
        if (!this.isMobile) return false; 
        return this.menuData[index]?.expanded === true;
    }

    getMenuClasses(index: number): string {
        if (!this.isMobile) return '';
        
        let classes = 'mobile-menu-item';
        if (this.isMenuExpanded(index)) {
            classes += ' expanded';
        }
        return classes;
    }

    trackByMenuId(index: number, item: ExtendedMenuItemDTO): string {
        return `${item.moduleDescription}-${index}`;
    }

    trackByMenuItemId(index: number, item: any): string {
        return `${item.description}-${index}`;
    }

    toggleSidebarTheme(): void {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme(): void {
        this.themeService.toggleHideSidebarTheme();
    }

    get isMobileDevice(): boolean {
        return this.isMobile;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (this.isMobile && !this.isToggled) {
            const target = event.target as HTMLElement;
            const sidebar = document.querySelector('.sidebar-area');
            const burgerMenu = document.querySelector('.burger-menu');
            
            if (sidebar && !sidebar.contains(target) && !burgerMenu?.contains(target)) {
                this.toggle();
            }
        }
    }
}
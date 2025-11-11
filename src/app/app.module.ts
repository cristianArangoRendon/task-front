import { MatExpansionModule } from '@angular/material/expansion';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDividerModule } from '@angular/material/divider';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './_layout/common/sidebar/sidebar.component';
import { FooterComponent } from './_layout/common/footer/footer.component';
import { HeaderComponent } from './_layout/common/header/header.component';
import { NotFoundComponent } from './_layout/common/not-found/not-found.component';
import { CustomizerSettingsComponent } from './_layout/customizer-settings/customizer-settings.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NotificationsService } from 'src/src/app/services/notifications.service';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        FooterComponent,
        HeaderComponent,
        NotFoundComponent,
        CustomizerSettingsComponent
        ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatIconModule,
        MatDividerModule,
        NgScrollbarModule,
        MatExpansionModule,
        MatMenuModule,
        ColorPickerModule,
        MatButtonModule,
    ],
    providers: [
        NotificationsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
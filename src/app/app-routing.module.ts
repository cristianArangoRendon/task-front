import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './_layout/common/not-found/not-found.component';
import { LoginComponent } from './presentation/login/login.component';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { UsersComponent } from './presentation/pages/public/users/users.component';
import { TasksComponent } from './presentation/pages/public/tasks/tasks.component';
import { DashboardComponent } from './presentation/dashboard/dashboard.component';


const routes: Routes = [
    { path: 'authentication/login', component: LoginComponent },
   
    {
        path: 'users/list',
        component: UsersComponent,
        canActivate: [AuthGuard],
    },

    {
        path: 'tasks/list',
        component: TasksComponent,
        canActivate: [AuthGuard],
    },

     {
        path: 'dashboard/list',
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
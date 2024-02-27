import { Routes } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { UsersComponent } from '../views/users/users.component';
import { UserListComponent } from '../views/user-list/user-list.component';
import { authGuard } from '../guard/auth.guard';
import { UnauthorizedComponent } from '../views/unauthorized/unauthorized.component';
import { ModalComponent } from '../components/modal/modal.component';
import { logGuard } from '../guard/log.guard';
import { HomeComponent } from '../views/home/home.component';
;

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent ,
    },
    {
        path: 'userRegister', component: UsersComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    },
    {
        path: 'userList', component: UserListComponent, canActivate: [authGuard], data: { roles: ['TEACHER'] }
    },
    {
        path: 'unauthorized', component: UnauthorizedComponent
    },
    {
        path: 'modal', component: ModalComponent
    },
    {
        path: '', component: HomeComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE','FATHER','TEACHER'] }
    }

];

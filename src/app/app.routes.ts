import { Routes } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { UsersComponent } from '../views/users/users.component';
import { UserListComponent } from '../views/user-list/user-list.component';
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'userRegister', component: UsersComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    },
    {
        path: 'userList', component: UserListComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    }

];

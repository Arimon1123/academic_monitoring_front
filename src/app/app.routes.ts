import { Routes } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { UsersComponent } from '../views/users/users.component';
import { UserListComponent } from '../views/user-list/user-list.component';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '', component: UsersComponent
    },
    {
        path: 'userList', component: UserListComponent 
    }

];

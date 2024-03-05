import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { authGuard } from './guard/auth.guard';
import { EditUserComponent } from './views/edit-user/edit-user.component';
import { HomeComponent } from './views/home/home.component';
import { SubjectRegisterComponent } from './views/subject-register/subject-register.component';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { UserListComponent } from './views/user-list/user-list.component';
import { UsersComponent } from './views/users/users.component';

;

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent,
    },
    {
        path: 'userRegister', component: UsersComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    },
    {
        path: 'userList', component: UserListComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    },
    {
        path: 'unauthorized', component: UnauthorizedComponent
    },
    {
        path: 'modal', component: ModalComponent
    },
    {
        path: '', component: HomeComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE', 'FATHER', 'TEACHER'] }
    },
    {
        path: 'editUser/:id', component: EditUserComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    },
    {
        path: 'subjectRegister', component: SubjectRegisterComponent, canActivate: [authGuard], data: { roles: ['ADMINISTRATIVE'] }
    }

];

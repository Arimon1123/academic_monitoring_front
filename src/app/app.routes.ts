import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { authGuard } from './guard/auth.guard';
import { EditUserComponent } from './views/edit-user/edit-user.component';
import { HomeComponent } from './views/home/home.component';
import { SubjectRegisterComponent } from './views/subject-register/subject-register.component';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { UserListComponent } from './views/user-list/user-list.component';
import { UsersComponent } from './views/users/users.component';
import { StudentRegisterComponent } from './views/student-register/student-register.component';
import { AssignationComponent } from './views/assignation/assignation.component';
import { RequireLicenseComponent } from './views/require-license/require-license.component';
import { PermissionListComponent } from './views/permission-list/permission-list.component';
import { PermissionDetailsComponent } from './views/permission-details/permission-details.component';
import { AttendanceComponent } from './views/attendance/attendance.component';
import { ActivityListComponent } from './views/activity-list/activity-list.component';
import { GradesComponent } from './views/grades/grades.component';
import { TeacherScheduleComponent } from './views/teacher-schedule/teacher-schedule.component';
import { StudentScheduleComponent } from './views/student-schedule/student-schedule.component';
import { StudentGradesComponent } from './views/student-grades/student-grades.component';
import { StudentActivitiesComponent } from './views/student-activities/student-activities.component';
import { ReportCardsComponent } from './views/report-cards/report-cards.component';
import { AnnouncementRegisterComponent } from './views/announcement-register/announcement-register.component';
import { ChatsComponent } from './views/chats/chats.component';
import { ReportsComponent } from './views/reports/reports.component';
import { TestComponent } from './views/test/test.component';
import { StudentListComponent } from './views/student-list/student-list.component';
import { EditStudentComponent } from './views/edit-student/edit-student.component';
import { StudentInscriptionComponent } from './views/student-inscription/student-inscription.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'userRegister',
    component: UsersComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMINISTRATIVE'] },
  },
  {
    path: 'userList',
    component: UserListComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'editUser/:id',
    component: EditUserComponent,
  },
  {
    path: 'subjectRegister',
    component: SubjectRegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMINISTRATIVE'] },
  },
  {
    path: 'studentRegister',
    component: StudentRegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMINISTRATIVE'] },
  },
  {
    path: 'assignation',
    component: AssignationComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMINISTRATIVE'] },
  },
  {
    path: 'requirePermission',
    component: RequireLicenseComponent,
  },
  {
    path: 'permissionList',
    component: PermissionListComponent,
  },
  {
    path: 'permissionDetails/:id',
    component: PermissionDetailsComponent,
  },
  {
    path: 'attendance/:id',
    component: AttendanceComponent,
    canActivate: [authGuard],
    data: { roles: ['TEACHER'] },
  },
  {
    path: 'activity/:id',
    component: ActivityListComponent,
  },
  {
    path: 'grades/:id',
    component: GradesComponent,
  },
  {
    path: 'teacherSchedule',
    component: TeacherScheduleComponent,
  },
  {
    path: 'studentSchedule/:id',
    component: StudentScheduleComponent,
  },
  {
    path: 'studentGrades/:id',
    component: StudentGradesComponent,
  },
  {
    path: 'studentActivities/student/:studentId/assignation/:assignationId/bimester/:bimester',
    component: StudentActivitiesComponent,
  },
  {
    path: 'reportCards',
    component: ReportCardsComponent,
  },
  {
    path: 'announcementRegister',
    component: AnnouncementRegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'chat',
    component: ChatsComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  },
  {
    path: 'studentList',
    component: StudentListComponent,
  },
  {
    path: 'editStudent/:id',
    component: EditStudentComponent,
  },
  {
    path: 'inscription',
    component: StudentInscriptionComponent,
  },
];

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDataDTO } from '../../models/UserDataDTO';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RoleDTO } from '../../models/RoleDTO';
import roles from '../../consts/roles.json';
import { UserCreateDTO } from '../../models/UserCreateDTO';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../service/modal.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { SubjectSelectionComponent } from '../../components/subject-selection/subject-selection.component';
import { SubjectDTO } from '../../models/SubjectDTO';
import { TeacherDTO } from '../../models/TeacherDTO';
import { ScheduleSelectionComponent } from '../../components/schedule-selection/schedule-selection.component';
import { UserDTO } from '../../models/UserDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime } from 'rxjs';
import { PersonService } from '../../service/person-service.service';
import { ScheduleDTO } from '../../models/ScheduleDTO';
import { TeacherService } from '../../service/teacher.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ModalComponent,
    SubjectSelectionComponent,
    ScheduleSelectionComponent,
    NgOptimizedImage,
    UserCardComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  user: UserDataDTO = {} as UserDataDTO;
  message: string = '';
  userUpdated = false;
  userDetails: UserDetailsDTO | undefined;
  subjects: SubjectDTO[] = [];
  teacherData: TeacherDTO | undefined;
  userRolesMap: Map<string, boolean> = new Map();
  selectedSubject: SubjectDTO[] = [];
  selectedSchedules: ScheduleDTO[] = [];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private personService: PersonService,
    private teacherService: TeacherService
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.getUserData(id);
    this.userForm
      .get('ci')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.checkCi();
      });
    this.userForm
      .get('phone')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.checkPhone();
      });
    this.userForm
      .get('email')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.checkEmail();
      });
    this.teacherForm
      .get('academicEmail')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.checkAcademicEmail();
      });
    this.roleForm.valueChanges.subscribe(() => {});
  }
  getUserData(id: number) {
    this.userService.getUser(id).subscribe({
      next: (data: ResponseDTO<UserDataDTO>) => {
        this.user = data.content;
        this.updateUserForm();
        if (this.userHasRole('TEACHER')) {
          this.getUserDetails();
        }
        this.checkRole();
      },
      error: (error: Error) => {
        console.error(error.message);
      },
    });
  }
  getUserDetails() {
    const year = new Date().getFullYear();
    this.userService
      .getUserDetails('TEACHER', this.user.username, year)
      .subscribe({
        next: (data: ResponseDTO<UserDetailsDTO>) => {
          this.userDetails = data.content;
          this.teacherData = this.userDetails.details as TeacherDTO;
          this.subjects = this.teacherData.subjects;
          this.teacherForm
            .get('academicEmail')
            ?.setValue(this.teacherData.academicEmail);
        },
      });
  }
  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    ci: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(12),
      Validators.pattern('^\\d{5,10}(?:[\\s-]\\w{1,2})?$'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$'),
    ]),
    address: new FormControl('', [Validators.required]),
  });
  roleForm: FormGroup = new FormGroup({
    admin: new FormControl(false, []),
    teacher: new FormControl(false, []),
    parent: new FormControl(false, []),
  });
  teacherForm: FormGroup = new FormGroup({
    academicEmail: new FormControl('', [Validators.required, Validators.email]),
  });
  checkRole() {
    this.userRolesMap.set('admin', !!this.userHasRole('ADMINISTRATIVE'));
    this.userRolesMap.set('teacher', !!this.userHasRole('TEACHER'));
    this.userRolesMap.set('parent', !!this.userHasRole('PARENT'));
    this.roleForm.setValue({
      admin: this.userRolesMap.get('admin'),
      teacher: this.userRolesMap.get('teacher'),
      parent: this.userRolesMap.get('parent'),
    });
  }
  addRoles() {
    const currentRoles = JSON.parse(JSON.stringify(roles));
    const newRoles: RoleDTO[] = [];
    if (this.roleForm.controls['admin'].value) {
      newRoles.push(
        currentRoles.roles.find(
          (role: RoleDTO) => role.name === 'ADMINISTRATIVE'
        )
      );
    }
    if (this.roleForm.controls['teacher'].value) {
      newRoles.push(
        currentRoles.roles.find((role: RoleDTO) => role.name === 'TEACHER')
      );
    }
    if (this.roleForm.controls['parent'].value) {
      newRoles.push(
        currentRoles.roles.find((role: RoleDTO) => role.name === 'PARENT')
      );
    }
    return newRoles;
  }

  areArraysEqual(array1: RoleDTO[] | undefined, array2: RoleDTO[]) {
    console.log(array1, array2);
    array1!.sort();
    array2.sort();
    return JSON.stringify(array1) === JSON.stringify(array2);
  }
  onPersonDataSubmitHandler() {
    if (this.userForm.invalid) {
      return;
    }
    const user: UserCreateDTO = {
      id: this.user.id,
      name: this.userForm.controls['name'].value,
      lastname: this.userForm.controls['lastname'].value,
      address: this.userForm.controls['address'].value,
      username: this.user.username,
      ci: this.userForm.controls['ci'].value,
      email: this.userForm.controls['email'].value,
      phone: this.userForm.controls['phone'].value,
      roles: this.addRoles(),
    };
    this.userService.updateUser(user).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.message = data.message;
        this.userUpdated = true;
        this.openModal('Usuario Actualizado', this.message);
      },
      error: (error: Error) => {
        console.error(error);
        this.message = error.message;
        this.openModal(this.message, 'Error');
      },
    });
  }
  openModal(message: string, title: string, submittable: boolean = false) {
    return this.modalService.open({
      content: this.content!,
      options: {
        isSubmittable: submittable,
        title: title,
        message: message,
      },
    });
  }
  updateUserForm() {
    this.userForm.setValue({
      name: this.user.name,
      lastname: this.user.lastname,
      ci: this.user.ci,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
    });
  }
  userHasRole(role: string) {
    return this.user.roles.find((userRole: RoleDTO) => {
      return userRole.name === role;
    });
  }
  onRoleFormSubmitHandler() {
    if (
      this.roleForm.controls['admin'].value === false &&
      this.roleForm.controls['teacher'].value === false &&
      this.roleForm.controls['parent'].value === false
    ) {
      this.message = 'Debe seleccionar al menos un rol';
      this.openModal(this.message, 'Error');
      return;
    }
    const user: UserDTO = {
      id: this.user.id,
      role: this.addRoles(),
      username: this.user.username,
      password: '',
      status: 0,
    };
    if (this.areArraysEqual(user.role, this.user.roles)) {
      this.message = 'No se realizaron cambios';
      this.openModal(this.message, 'Sin cambios');
      return;
    }
    this.userService.updateUserRoles(user).subscribe({
      error: (error: HttpErrorResponse) => {
        this.message = error.message;
        this.openModal(this.message, 'Error');
      },
      complete: () => {
        this.openModal(
          'Se actualizaron los roles correctamente',
          'Actualización exitosa'
        );
        this.userDetails = undefined;
        this.getUserData(user.id);
      },
    });
  }
  checkEmail() {
    if (this.userForm.get('email')?.errors) return;
    const value = this.userForm.controls['email'].value;
    if (value == this.user.email) return;
    this.personService.existsByEmail(value ?? '').subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content && value !== this.user.email) {
          this.userForm.controls['email'].setErrors({
            emailExists: data.content,
          });
        }
      },
    });
  }
  checkPhone() {
    if (this.userForm.get('phone')?.errors) return;
    const value = this.userForm.get('phone')?.value;
    if (value === this.user.phone) return;
    this.personService.existsByPhone(value ?? '').subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content && value !== this.user.phone) {
          this.userForm.controls['phone'].setErrors({ phoneExists: true });
        }
      },
    });
  }
  checkCi() {
    if (this.userForm.get('ci')?.errors) return;
    const value = this.userForm.get('ci')?.value;
    if (value === this.user.ci) return;
    this.personService.existsByCi(value ?? '').subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content && value !== this.user.ci) {
          this.userForm.controls['ci'].setErrors({ ciExists: true });
        }
      },
    });
  }
  onUpdateSubjectsHandler(newSubjects: SubjectDTO[]) {
    this.selectedSubject = newSubjects;
  }
  onUpdateScheduleHandler(newSchedules: ScheduleDTO[]) {
    this.selectedSchedules = newSchedules;
  }
  onSubmitSubjectHandler() {
    this.teacherService
      .updateTeacherSubjects(
        <number>this.userDetails?.details.id,
        this.selectedSubject
      )
      .subscribe({
        complete: () => {
          this.openModal(
            'Se actualizaron las materias exitosamente',
            'Materias actualizadas'
          );
        },
      });
  }
  onSubmitConsultHoursHandler() {
    this.teacherService
      .updateTeacherConsultHours(
        <number>this.userDetails?.details.id,
        this.selectedSchedules
      )
      .subscribe({
        complete: () => {
          this.openModal(
            'Se actualizaron los horarios de consulta exitosamente',
            'Horarios de consulta actualizados'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.openModal(error.message, 'Error al actualizar las materias');
        },
      });
  }
  checkAcademicEmail() {
    if (this.teacherForm.get('academicEmail')?.errors) return;
    const value = this.teacherForm.get('academicEmail')?.value;
    if (value === this.teacherData?.academicEmail) return;
    this.teacherService.existsByAcademicEmail(value).subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content && value !== this.teacherData?.academicEmail) {
          this.teacherForm.controls['academicEmail'].setErrors({
            emailExists: true,
          });
        }
      },
    });
  }
  onSubmitAcademicEmailHandler() {
    const value = this.teacherForm.get('academicEmail')?.value;
    this.teacherService
      .updateTeacherAcademicEmail(<number>this.teacherData?.id, value)
      .subscribe({
        complete: () => {
          this.openModal(
            'Se actualizo el correo correctamente',
            'Actualización de correo'
          );
        },
      });
  }
  onBlockUserHandler(username: string) {
    this.openModal(
      `Está seguro de bloquear el acceso al usuario ${this.user.name} ${this.user.lastname}`,
      'Bloquear acesso'
    ).subscribe({
      complete: () => {
        this.userService.blockUser(username).subscribe({
          complete: () => {
            this.openModal(
              `Se bloqueo el acceso al usuario ${this.user.name} ${this.user.lastname} correctamente`,
              'Bloqueo de usuario',
              false
            );
          },
        });
      },
    });
  }
  onUnblockUserHandler(username: string) {
    this.openModal(
      `Esta seguro de restablecer el accesos del usuario ${this.user.name} ${this.user.lastname}`,
      'Restablecer el acceso'
    ).subscribe({
      complete: () => {
        this.userService.unblockUser(username).subscribe({
          complete: () => {
            this.openModal(
              `El acceso al usuario ${this.user.name} ${this.user.lastname} se ha restablecido correctamente`,
              'Restablecer accesos',
              false
            );
            this.getUserData(this.user.id);
          },
        });
      },
    });
  }
}

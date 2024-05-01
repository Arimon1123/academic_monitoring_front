import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserDataDTO } from '../../models/UserDataDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { RoleDTO } from '../../models/RoleDTO';
import roles from '../../consts/roles.json';
import { UserCreateDTO } from '../../models/UserCreateDTO';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../service/modal.service';
import { ResponseDTO } from '../../models/ResponseDTO';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ModalComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  user: UserDataDTO = {} as UserDataDTO;
  message: string = '';
  userUpdated = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private router: Router
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    console.log(id);
    this.userService.getUser(id).subscribe({
      next: (data: ResponseDTO<UserDataDTO>) => {
        this.user = data.content;
        this.userForm.setValue({
          name: this.user.name,
          lastname: this.user.lastname,
          ci: this.user.ci,
          email: this.user.email,
          phone: this.user.phone,
          teacher: this.checkRole('TEACHER'),
          father: this.checkRole('FATHER'),
          admin: this.checkRole('ADMINISTRATIVE'),
        });
      },
      error: (error: Error) => {
        console.error(error.message);
      },
    });
  }

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', []),
    lastname: new FormControl('', []),
    ci: new FormControl('', []),
    email: new FormControl('', []),
    phone: new FormControl('', []),
    admin: new FormControl(false, []),
    teacher: new FormControl(false, []),
    father: new FormControl(false, []),
  });
  checkRole(role: string) {
    const userRoles = this.user.roles;
    return (
      userRoles.find((userRole: RoleDTO) => {
        return userRole.name === role;
      }) !== undefined
    );
  }
  addRoles() {
    const currentRoles = JSON.parse(JSON.stringify(roles));
    const newRoles: RoleDTO[] = [];
    if (this.userForm.controls['admin'].value) {
      newRoles.push(
        currentRoles.roles.find(
          (role: RoleDTO) => role.name === 'ADMINISTRATIVE'
        )
      );
    }
    if (this.userForm.controls['teacher'].value) {
      newRoles.push(
        currentRoles.roles.find((role: RoleDTO) => role.name === 'TEACHER')
      );
    }
    if (this.userForm.controls['father'].value) {
      newRoles.push(
        currentRoles.roles.find((role: RoleDTO) => role.name === 'FATHER')
      );
    }
    return newRoles;
  }
  onSubmit() {
    if (
      this.userForm.controls['admin'].value === false &&
      this.userForm.controls['teacher'].value === false &&
      this.userForm.controls['father'].value === false
    ) {
      this.message = 'Debe seleccionar al menos un rol';
      this.openModal(this.message, 'Error');
      return;
    }
    const user: UserCreateDTO = {
      id: this.user.id,
      name: this.userForm.controls['name'].value,
      lastname: this.userForm.controls['lastname'].value,
      address: this.user.address,
      username: this.user.username,
      ci: this.userForm.controls['ci'].value,
      email: this.userForm.controls['email'].value,
      phone: this.userForm.controls['phone'].value,
      roles: this.addRoles(),
    };

    this.userService.updateUser(user).subscribe({
      next: (data: ResponseDTO<string>) => {
        console.log(data.message);
        this.message = data.message;
        this.userUpdated = true;
        this.openModal('Usuario Actualizado', this.message);
        this.router.navigate(['/userList']);
      },
      error: (error: Error) => {
        console.error(error);
        this.message = error.message;
        this.openModal(this.message, 'Error');
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  openModal(message: string, title: string) {
    return this.modalService.open({
      content: this.content!,
      options: {
        isSubmittable: true,
        title: title,
        message: message,
      },
    });
  }
}

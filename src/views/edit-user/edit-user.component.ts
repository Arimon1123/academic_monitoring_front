import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDataDTO } from '../../models/UserDataDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { RoleDTO } from '../../models/RoleDTO';
import roles from "../../consts/consts.json";
import { UserCreateDTO } from '../../models/UserCreateDTO';
import { ModalComponent } from '../../components/modal/modal.component';
import { Flowbite } from '../../decorator/flowbite';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-editUser',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ModalComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
@Flowbite()
export class EditUserComponent implements OnInit {

  @ViewChild('modal') modalComponent: ModalComponent | undefined;

  currentRoles: { [key: string]: string } = environment.currentRoles;
  user: UserDataDTO = {} as UserDataDTO;
  message: string = '';
  userUpdated = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }
  ngOnInit() {
    initFlowbite();
    const id = this.route.snapshot.params['id'];
    console.log(id);
    this.userService.getUser(id).subscribe({
      next: (data: any) => {
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
      error: (error: any) => {
        console.error(error);
      }
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
    return userRoles.find((userRole: RoleDTO) => {
      return userRole.name === role;
    }) !== undefined;
  }
  addRoles() {

    const currentRoles = JSON.parse(JSON.stringify(roles));
    let newRoles: RoleDTO[] = [];
    if (this.userForm.controls['admin'].value) {
      newRoles.push(currentRoles.roles.find((role: any) => role.name === 'ADMINISTRATIVE'));
    }
    if (this.userForm.controls['teacher'].value) {
      newRoles.push(currentRoles.roles.find((role: any) => role.name === 'TEACHER'));
    }
    if (this.userForm.controls['father'].value) {
      newRoles.push(currentRoles.roles.find((role: any) => role.name === 'FATHER'));
    }
    return newRoles;
  }
  onSubmit() {
    if (this.userForm.controls['admin'].value === false
      && this.userForm.controls['teacher'].value === false &&
      this.userForm.controls['father'].value === false) {
      this.message = 'Debe seleccionar al menos un rol';
      this.showModal();
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
      roles: this.addRoles()
    }

    this.userService.updateUser(user).subscribe({
      next: (data: any) => {
        console.log(data);
        this.message = data.message;
        this.userUpdated = true;
      },
      error: (error: any) => {
        console.error(error);
        this.message = error.error.message;
        this.modalComponent?.toggleModal();
      },
      complete: () => {
        console.log('complete');
        this.modalComponent?.toggleModal();
      }
    })
  }

  closeModal() {
    this.modalComponent?.toggleModal();
  }
  showModal() {
    this.modalComponent?.toggleModal();
  }
  goToUserList() {
    window.location.href = '/userList';
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LocalStorageService } from './service/local-storage.service';
import { UserService } from './service/user.service';
import { NavsComponent } from './components/navs/navs.component';
import { UserDTO } from './models/UserDTO';
import { ModalComponent } from './components/modal/modal.component';
import { RoleDTO } from './models/RoleDTO';
import { roles } from './consts/roles.json';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from './environments/environment.development';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NavsComponent, ModalComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  @ViewChild("modal") modalComponent: ModalComponent | undefined;

  title = 'frontend_academic_monitoring';
  user: UserDTO | undefined;
  isLogged: boolean = false;
  currentRole: string = '';
  currentRoles: RoleDTO[] = [];
  roleNames: any;
  showNavs = false;
  form: FormGroup = new FormGroup({
    roleId: new FormControl('0')
  });
  constructor(private userService: UserService, private localStorage: LocalStorageService, private router: Router) {
  }
  ngOnInit() {

    initFlowbite();
    this.roleNames = environment.currentRoles;
    this.user = JSON.parse(this.localStorage.getItem('userDetails') as string);
    this.currentRole = JSON.parse(this.localStorage.getItem('currentRole') as string);
    this.isLogged = this.localStorage.getItem('isLogged') == "Sesion Iniciada" ? true : false;
    console.log(this.isLogged);
    if (!this.isLogged) {
      this.showNavs = true;
    }
    console.log(this.currentRole)
    if (this.isLogged && !this.currentRole) {
      this.localStorage.removeItem('isLogged');
    }
    this.currentRoles = roles;
    if (this.user && !this.currentRole) {
      if (this.user?.role?.length === 1) {
        this.currentRole = this.user.role[0].name;
      } else {
        if (this.user?.role?.length ?? 0 > 1) {
          setTimeout(() => {
            this.modalComponent?.showModal();
          }, 500)
        }
      }

    } else {
      this.showNavs = true;
    }
    this.getRoleDetails(this.currentRole);
  }
  getUserDetails() {
    this.userService.userDetails().subscribe(
      (data: any) => {
        this.localStorage.setItem('userDetails', data);
        this.user = JSON.parse(this.localStorage.getItem('userDetails') as string);
      })
  }
  showModal() {
    this.modalComponent?.showModal();
  }
  closeModal() {
    this.modalComponent?.hideModal();
  }

  saveCurrentRole() {
    const roleId = this.form.controls['roleId'].value
    console.log(parseInt(roleId));
    const savedRole = this.currentRoles.find((role: RoleDTO) => {
      return parseInt(roleId) === role.id;
    });
    this.currentRole = savedRole?.name ?? '';
    this.localStorage.setItem('currentRole', JSON.stringify(savedRole?.name));
    this.showNavs = true;
    this.closeModal();
  }

  getRoleDetails(role: string) {
    this.userService.getUserRoleDetails(role).subscribe(
      (data: any) => {
        console.log(data);
        this.localStorage.setItem('roleDetails', JSON.stringify(data));
      }
    )
  }
}

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
import {TeacherDTO} from "./models/TeacherDTO";
import {ParentDTO} from "./models/ParentDTO";
import {ResponseDTO} from "./models/ResponseDTO";
import myLocalEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";

registerLocaleData(myLocalEs, "es-ES");

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
  roleDetails: ParentDTO | TeacherDTO;
  showNavs = false;
  form: FormGroup = new FormGroup({
    roleId: new FormControl('0')
  });
  constructor(private userService: UserService, private localStorage: LocalStorageService, private router: Router) {
    this.user = {} as UserDTO;
    this.roleDetails = {} as ParentDTO;
  }
  ngOnInit() {

    initFlowbite();
    this.roleNames = environment.currentRoles;
    this.user = JSON.parse(this.localStorage.getItem('userDetails') as string);
    this.currentRole = JSON.parse(this.localStorage.getItem('currentRole') as string);
    this.isLogged = this.localStorage.getItem('isLogged') == "Sesion Iniciada";
    this.roleDetails = JSON.parse(this.localStorage.getItem('roleDetails') as string);
    if(!this.currentRole && this.isLogged && this.user){
      if(this.user.role.length === 1 ){
        this.currentRole = this.user.role[0].name;
        this.localStorage.setItem('currentRole', JSON.stringify(this.currentRole));
      }else{
        setTimeout(() => {
          this.showModal();
        },500);
      }
      if(!this.roleDetails){
        this.getRoleDetails(this.currentRole);
      }
    }
    if((this.currentRole && this.isLogged) || !this.isLogged){
      this.showNavs = true;
    }
    if(this.currentRole && !this.roleDetails){
      this.getRoleDetails(this.currentRole);
    }


  }

  showModal() {
    this.modalComponent?.showModal();
  }
  closeModal() {
    this.modalComponent?.hideModal();
  }
  parseRoleDetails(){
   this.currentRole = JSON.parse(this.localStorage.getItem('currentRole') as string);
  }
  saveCurrentRole() {
    const roleId = this.form.controls['roleId'].value
    const savedRole = this.currentRoles.find((role: RoleDTO) => {
      return parseInt(roleId) === role.id;
    });
    this.currentRole = savedRole?.name ?? '';
    this.localStorage.setItem('currentRole', JSON.stringify(savedRole?.name));
    this.showNavs = true;
    this.getRoleDetails(this.currentRole);
    this.closeModal();
  }

  getRoleDetails(role: string) {
    this.userService.getUserRoleDetails(role).subscribe(
      (data: ResponseDTO<any>) => {
        this.localStorage.setItem('roleDetails', JSON.stringify(data.content));
      }
    )
  }
}

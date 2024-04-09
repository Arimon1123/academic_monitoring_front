import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { AuthService } from '../../service/auth-service.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { RouteDTO } from '../../models/RouteDTO';
import  routes from '../../consts/routes.json';
import { initFlowbite } from 'flowbite';
import {ParentDTO} from "../../models/ParentDTO";
import {TeacherDTO} from "../../models/TeacherDTO";
import {AdministrativeDTO} from "../../models/AdministrativeDTO";
import {UserDetailsDTO} from "../../models/UserDetailsDTO";

@Component({
  selector: 'app-navs',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navs.component.html',
  styleUrl: './navs.component.css'
})
export class NavsComponent implements OnInit, OnChanges {

  routesList: RouteDTO[] = []
  @Input() userDetails: UserDetailsDTO;
  @Output() logoutEvent = new EventEmitter<boolean>();
  constructor(private authService: AuthService, private router: Router) {
    this.userDetails = {} as UserDetailsDTO;
  }
  ngOnChanges(){
    this.buildRoutes();
  }
  ngOnInit() {
    initFlowbite();
    this.buildRoutes();
  }
  buildRoutes(){
    if (this.userDetails.role === 'ADMINISTRATIVE') {
      this.routesList = routes.ADMINISTRATIVE;
    }
    if(this.userDetails.role === 'TEACHER'){
      this.routesList = routes.TEACHER;
    }
    if(this.userDetails.role === 'PARENT'){
      this.routesList = routes.PARENT;
    }
  }
  logout() {
    console.log('logout');
    this.authService.logout().subscribe({
      complete: () => {
        this.logoutEvent.emit(true);
      }
    });
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '../../service/auth-service.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import routes from '../../consts/routes.json';
import { initFlowbite } from 'flowbite';

import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { RouteTupleDTO } from '../../models/RouteTupleDTO';

@Component({
  selector: 'app-navs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navs.component.html',
  styleUrl: './navs.component.css',
})
export class NavsComponent implements OnInit, OnChanges {
  routesList: RouteTupleDTO = {} as RouteTupleDTO;
  @Input() userDetails: UserDetailsDTO;
  @Output() logoutEvent = new EventEmitter<boolean>();
  constructor(private authService: AuthService) {
    this.userDetails = {} as UserDetailsDTO;
  }
  ngOnChanges() {
    console.log(this.userDetails);
    this.buildRoutes();
  }
  ngOnInit() {
    setTimeout(() => {
      initFlowbite();
    }, 500);
  }
  buildRoutes() {
    console.log(this.userDetails.role);
    if (this.userDetails.role === 'ADMINISTRATIVE') {
      this.routesList = routes.ADMINISTRATIVE;
    }
    if (this.userDetails.role === 'TEACHER') {
      this.routesList = routes.TEACHER;
    }
    if (this.userDetails.role === 'PARENT') {
      this.routesList = routes.PARENT;
    }
  }
  logout() {
    console.log('logout');
    this.authService.logout().subscribe({
      complete: () => {
        this.logoutEvent.emit(true);
      },
    });
  }
  showList(id: string) {
    const element = document.getElementById(id);
    const display = element?.style.display;
    if (display === '' || display === 'none') {
      element!.style.display = 'flex';
    }
    if (display === 'flex') {
      element!.style.display = '';
    }
  }
}

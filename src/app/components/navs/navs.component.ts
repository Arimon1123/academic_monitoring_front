import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '../../service/auth-service.service';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
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
  @Input() userDetails?: UserDetailsDTO;
  @Output() logoutEvent = new EventEmitter<boolean>();
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.userDetails = {} as UserDetailsDTO;
    this.router.events.subscribe({
      next: event => {
        if (event instanceof NavigationEnd) {
          this.title = this.findRouteName(this.router.url);
        }
      },
    });
  }
  title: string = '';
  ngOnChanges() {
    console.log(this.userDetails);
    this.buildRoutes();
    this.title = this.findRouteName(this.router.url);
    setTimeout(() => {
      initFlowbite();
    }, 500);
  }
  ngOnInit() {
    setTimeout(() => {
      initFlowbite();
    }, 500);
  }
  buildRoutes() {
    console.log(this.userDetails?.role);
    if (this.userDetails?.role === 'ADMINISTRATIVE') {
      this.routesList = routes.ADMINISTRATIVE;
    }
    if (this.userDetails?.role === 'TEACHER') {
      this.routesList = routes.TEACHER;
    }
    if (this.userDetails?.role === 'PARENT') {
      this.routesList = routes.PARENT;
    }
    if (this.userDetails?.role === 'STUDENT') {
      this.routesList = routes.STUDENT;
    }
  }
  logout() {
    console.log('logout');
    this.authService.logout().subscribe({
      complete: () => {
        this.logoutEvent.emit(false);
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
  findRouteName(routerUrl: string) {
    const url = '/' + routerUrl.split('/')[1].split('?')[0];
    console.log(url);
    if (this.routesList.parentRoutes) {
      for (const parent of this.routesList.parentRoutes) {
        for (const children of parent.children) {
          if (url === children.route) {
            console.log(parent.title + ' > ' + children.title);
            return parent.title + ' > ' + children.title;
          }
        }
      }
    }
    if (this.routesList.childRoutes) {
      for (const child of this.routesList.childRoutes) {
        if (url === child.route) {
          console.log(child.title);
          return child.title;
        }
      }
    }
    if (this.routesList.uniqueRoutes) {
      for (const child of this.routesList.uniqueRoutes) {
        if (url === child.route) {
          console.log(child.title);
          return child.title;
        }
      }
    }
    return '';
  }
}

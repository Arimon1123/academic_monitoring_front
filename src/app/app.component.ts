import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './service/auth-service.service';
import { LocalStorageService } from './service/local-storage.service';
import { UserService } from './service/user.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'frontend_academic_monitoring';
  constructor(private authService: AuthService, private router: Router, private userService: UserService, private localStorage: LocalStorageService) {

  }
  ngOnInit() {
    initFlowbite();

  }
  getUserDetails() {
    this.userService.userDetails().subscribe((data: any) => {
      this.localStorage.setItem('userDetails', data);
    });
  }


  logout() {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('userDetails');
    this.authService.logout().subscribe((data: any) => {
      console.log(data);
    });
    this.router.navigate(['/login']);
  }
}

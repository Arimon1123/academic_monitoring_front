import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';
import { AuthServiceService } from '../service/auth-service.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'frontend_academic_monitoring';
  constructor(private authService: AuthServiceService, private router: Router) { }
  ngOnInit() {
    initFlowbite();
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

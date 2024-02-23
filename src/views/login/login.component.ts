import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LogInService } from '../../service/log-in.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth-service.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  providers: [LogInService, HttpClient],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private loginService: AuthService, private userService: UserService, private router: Router) { }
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9]+$')]),
  })


  login(event: any) {
    event.preventDefault();
    this.loginService.login(this.loginForm.value)
      .subscribe({
        next: (data: any) => {

          localStorage.setItem('isLogged', JSON.stringify(true));
        },
        error: (error: any) => {
          alert("Error en el login");
        },
        complete: () => {
          this.userService.userDetails().subscribe({
            next: (data: any) => {
              localStorage.setItem('userDetails', JSON.stringify(data));
            },
            complete: () => {
              alert("Login exitoso");
              this.router.navigate(['/userList']);
            }
          });
        }
      })
  }
}

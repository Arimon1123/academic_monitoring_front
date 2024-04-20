import {Component, EventEmitter, Output} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import {UserDataService} from "../../service/user-data.service";
import {ResponseDTO} from "../../models/ResponseDTO";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  providers: [HttpClient],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private loginService: AuthService,
    private router: Router,
    private userData: UserDataService) { }
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5),]),
  })
  @Output() loginEvent = new EventEmitter<boolean>();
  isInvalid = false;
  requestSent = false;

  login() {
    this.requestSent = true;
    let isLogged = false;
    this.loginService.login(this.loginForm.value)
      .subscribe({
        next: (data:ResponseDTO<boolean>) => {
          isLogged = data.content;
        },
        error: (error: any) => {
          this.requestSent = false;
          if (error.status === 401) {
            this.isInvalid = true;
          }
        },
        complete: () => {
          this.loginEvent.emit(isLogged);
        }
      })
  }
}

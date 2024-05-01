import { Component, EventEmitter, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth-service.service';
import { ResponseDTO } from '../../models/ResponseDTO';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [HttpClient],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private loginService: AuthService) {}
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(5),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(5),
    ]),
  });
  @Output() loginEvent = new EventEmitter<boolean>();
  isInvalid = false;
  requestSent = false;

  login() {
    this.requestSent = true;
    let isLogged = false;
    this.loginService.login(this.loginForm.value).subscribe({
      next: (data: ResponseDTO<boolean>) => {
        isLogged = data.content;
      },
      error: (error: HttpErrorResponse) => {
        this.requestSent = false;
        if (error.status === 401) {
          this.isInvalid = true;
        }
      },
      complete: () => {
        this.loginEvent.emit(isLogged);
      },
    });
  }
}

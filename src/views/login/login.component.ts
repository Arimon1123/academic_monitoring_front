import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LogInService } from '../../service/log-in.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  providers: [LogInService,HttpClient],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private loginService: LogInService) { }
  loginForm : FormGroup = new FormGroup({
    username: new FormControl('',[Validators.required, Validators.maxLength(20), Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9]+$')]),
  })


  login(event: any){
    event.preventDefault();
    this.loginService.login(this.loginForm.value).subscribe(
      {
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
}

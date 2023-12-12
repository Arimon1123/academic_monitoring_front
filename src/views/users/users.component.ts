import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserCreateDTO } from '../../models/userCreateDTO';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  constructor(private userService: UserService) { }

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(4),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10),]),
    address: new FormControl('', [Validators.required, Validators.minLength(4)]),
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    role: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  onSubmit() {
    if (this.userForm.valid) {
      const user: UserCreateDTO = {
        name: this.userForm.controls.name!.value!,
        lastname: this.userForm.controls.lastname.value!,
        email: this.userForm.controls.email.value!,
        phone: this.userForm.controls.phone.value!,
        address: this.userForm.controls.address.value!,
        username: this.userForm.controls.username.value!,
        password: this.userForm.controls.password.value!,
        role: this.userForm.controls.role.value!,
      }
      this.userService.createUser(user).subscribe((data: any) => {
        alert("Usuario creado")
        this.userForm.reset();
      });
    } else {
      alert("Formulario invalido");
    }

  }
}
// name: string;
// lastname: string;
// email: string;
// password: string;
// phone: string;
// address: string;
// role: string;
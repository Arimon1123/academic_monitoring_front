import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserCreateDTO } from '../../models/UserCreateDTO';
import { Subject, debounce, debounceTime, map } from 'rxjs';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  constructor(private userService: UserService) { }

  showPassword = false;
  imageFile: File | null = null;
  userImage: string = "../../assets/user.svg";
  hasImage = false;
  usernameIsAvailable = true;
  subject = new Subject();

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(4),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10),]),
    address: new FormControl('', [Validators.required, Validators.minLength(4)]),
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    ci: new FormControl('', [Validators.required, Validators.minLength(4)]),
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
        ci: this.userForm.controls.ci.value!,
        role: this.userForm.controls.role.value!,
      }
      const formData = new FormData();
      formData.append('user', JSON.stringify(user));
      if (this.hasImage) {
        formData.append('image', this.imageFile as Blob);
      }
      this.userService.createUser(formData).subscribe((data: any) => {
        alert("Usuario creado")
        this.userForm.reset();
      });
    } else {
      alert("Formulario invalido");
    }

  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
    console.log(this.imageFile);
    this.hasImage = true;
    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile as Blob);
    reader.onload = () => {
      this.userImage = reader.result as string;
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  // usernameCheck = (($event: any) => {
  //   this.subject.next($event);
  //   this.subject.pipe(debounceTime(500)).subscribe((value: any) => {
  //     this.userService.checkUsername(value).subscribe((data: any) => {
  //       this.usernameIsAvailable = data;
  //       console.log(data);
  //     });
  //   })
  // })
}
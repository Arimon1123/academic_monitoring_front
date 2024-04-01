import {Component, TemplateRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { PersonService } from '../../service/person-service.service';
import { ModalComponent } from '../../components/modal/modal.component';
import roles from "../../consts/roles.json";
import { UserCreateDTO } from '../../models/UserCreateDTO';
import { Flowbite } from '../../decorator/flowbite';
import { RoleDTO } from '../../models/RoleDTO';
import {NgOptimizedImage} from "@angular/common";
import {initFlowbite} from "flowbite";
import {ModalService} from "../../service/modal.service";



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, NgOptimizedImage],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  constructor(private userService: UserService, private personService: PersonService, private modalService:ModalService) { }
  @ViewChild("modal") modal: TemplateRef<any> | undefined;
  imageFile: File | null = null;
  userImage: string = "../../assets/user.svg";
  hasImage = false;
  requestSend = false;
  modalMessage = "";
  modalTitle = "";

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(4),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    address: new FormControl('', [Validators.required, Validators.minLength(4)]),
    ci: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern("^\\d{5,10}(?:[\\s-]\\w{1,2})?$")]),
    role: new FormControl('TEACHER', [Validators.required, Validators.minLength(4)]),
    workEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    this.requestSend = true;
    if (this.userForm.controls.role.value !== 'TEACHER') {
      this.userForm.controls.workEmail.setValidators([Validators.email]);
    }

    const currentRoles: any = JSON.parse(JSON.stringify(roles));
    const selected = currentRoles.roles.find((role: RoleDTO) => role.name === this.userForm.controls.role.value)
    console.log(selected);
    if (this.userForm.valid) {
      const user: UserCreateDTO = {
        name: this.userForm.controls.name!.value!,
        lastname: this.userForm.controls.lastname.value!,
        email: this.userForm.controls.email.value!,
        phone: this.userForm.controls.phone.value!,
        address: this.userForm.controls.address.value!,
        ci: this.userForm.controls.ci.value!,
        academicEmail: this.userForm.controls.workEmail.value!,
        roles: [selected],
      }
      const formData = new FormData();
      formData.append('user', JSON.stringify(user));
      if (this.hasImage) {
        formData.append('image', this.imageFile as Blob);
      }
      this.userService.createUser(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.modalMessage = "Usuario creado exitosamente";
          this.modalTitle = "Usuario creado "
          this.openModal();
          this.userForm.reset();
          this.userImage = "../../assets/user.svg";
        },
        error: (error: any) => {
          console.log(error);
          this.modalMessage = error.error.message;
          this.modalTitle = "Error al crear el usuario"
          this.openModal();
          this.requestSend = false;
        },
        complete: () => {
          this.requestSend = false;
        }

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
  checkEmail() {
    if (this.userForm.get('email')?.errors) {
      return;
    }
    this.personService.existsByEmail(this.userForm.controls.email.value ?? '').subscribe(
      {
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.userForm.controls.email.setErrors({ 'emailExists': true });
          }
        }
      }
    );
  }
  checkPhone() {
    if (this.userForm.get('phone')?.errors) {
      return;
    }
    this.personService.existsByPhone(this.userForm.controls.phone.value ?? '').subscribe(
      {
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.userForm.controls.phone.setErrors({ 'phoneExists': true });
          }
        }
      }
    );
  }
  checkCi() {
    if (this.userForm.get('ci')?.errors) {
      return;
    }
    this.personService.existsByCi(this.userForm.controls.ci.value ?? '').subscribe(
      {
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.userForm.controls.ci.setErrors({ 'ciExists': true });
          }
        }
      }
    );
  }

  changeValidators($event: any) {

    if ($event.target.value === 'TEACHER') {
      this.userForm.controls.workEmail.setValidators([Validators.required, Validators.email]);
      this.userForm.get('workEmail')?.updateValueAndValidity();
    } else {
      this.userForm.get('workEmail')?.clearValidators();
      this.userForm.get('workEmail')?.updateValueAndValidity();
      console.log(this.userForm.controls.workEmail.errors);
    }
  }
  openModal() {
    const content = this.modal!;
    console.log(content);
    this.modalService.open(
      {
        content: content,
        options: {
          size: 'small' ,
          title: this.modalTitle,
          message: this.modalMessage,
          isSubmittable: false
        }
      });
  }

}

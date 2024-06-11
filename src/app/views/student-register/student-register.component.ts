import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ParentDTO } from '../../models/ParentDTO';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StudentCreateDTO } from '../../models/StudentCreateDTO';
import { StudentService } from '../../service/student.service';
import { ModalService } from '../../service/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime } from 'rxjs';
import { UserService } from '../../service/user.service';
import { ParentSearchComponent } from '../../components/parent-search/parent-search.component';
import { ClassSelectComponent } from '../../components/class-select/class-select.component';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ParentSearchComponent,
    ClassSelectComponent,
  ],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css',
})
export class StudentRegisterComponent {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  minDate = this.calculateMinDate();
  maxDate = this.calculateMaxDate();
  parentList: ParentDTO[] = [];
  selectedParentList: ParentDTO[] = [];
  constructor(
    private studentService: StudentService,
    private modalService: ModalService,
    private userService: UserService
  ) {
    this.studentForm
      .get('rude')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.existsStudentByRude();
      });
    this.studentForm
      .get('ci')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.existsStudentByCi();
      });
    this.studentForm
      .get('email')
      ?.valueChanges.pipe(debounceTime(350))
      .subscribe(() => {
        this.existsStudentByEmail();
      });
  }

  studentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fatherLastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    motherLastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    ci: new FormControl('', [Validators.required, Validators.minLength(3)]),
    birthDate: new FormControl('', [Validators.required]),
    rude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.email,
    ]),
    classId: new FormControl('', [Validators.required]),
    gradeId: new FormControl('-1'),
  });
  calculateMaxDate() {
    const date = new Date();
    return new Date(date.getFullYear() - 6, 2, 31).toISOString().split('T')[0];
  }
  calculateMinDate() {
    const date = new Date();
    return new Date(date.getFullYear() - 19, 2, 31).toISOString().split('T')[0];
  }
  addParent(parent: ParentDTO) {
    if (this.selectedParentList.length >= 2) {
      this.openModal('Error', 'No se puede agregar más padres');
      return;
    }
    if (this.selectedParentList.indexOf(parent) !== -1) {
      this.openModal('Error', 'El padre ya fue seleccionado');
      return;
    }
    this.selectedParentList.push(parent);
  }
  existsStudentByCi() {
    if (this.studentForm.controls['ci'].errors) {
      return;
    }
    const ci = this.studentForm.value.ci;
    this.studentService.existsStudentByCi(ci).subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content) {
          this.studentForm.controls['ci'].setErrors({ exists: true });
        }
      },
    });
  }
  existsStudentByEmail() {
    if (this.studentForm.controls['email'].errors) {
      return;
    }
    const email = this.studentForm.value.email;
    this.studentService.existsStudentByEmail(email).subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content) {
          this.studentForm.controls['email'].setErrors({ exists: true });
        }
      },
    });
  }
  existsStudentByRude() {
    if (this.studentForm.controls['rude'].errors) {
      return;
    }
    const rude = this.studentForm.value.rude;
    this.studentService.existsStudentByRude(rude).subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content) {
          this.studentForm.controls['rude'].setErrors({ exists: true });
        }
      },
    });
  }
  removeParent(parentId: number) {
    this.selectedParentList = this.selectedParentList.filter(
      parent => parent.id !== parentId
    );
  }
  onSubmit() {
    const student: StudentCreateDTO = {
      id: null,
      name: this.studentForm.value.name,
      ci: this.studentForm.value.ci,
      fatherLastname: this.studentForm.value.fatherLastname,
      motherLastname: this.studentForm.value.motherLastname,
      birthDate: this.studentForm.value.birthDate,
      address: this.studentForm.value.address,
      rude: this.studentForm.value.rude,
      classId: this.studentForm.value.classId,
      email: this.studentForm.value.email,
      parentId: [...this.selectedParentList.map(parent => parent.id)],
    };
    this.userService.saveStudent(student).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Registro de estudiante', data.message);
        this.formReset();
      },
      error: (error: HttpErrorResponse) => {
        this.openModal(
          'Registro de estudiante',
          'Error al registrar el estudiante ' + error.error.message
        );
      },
    });
  }
  formReset() {
    this.studentForm.reset();
    this.selectedParentList = [];
    this.studentForm.controls['gradeId'].setValue('-1');
    this.studentForm.updateValueAndValidity();
    this.parentList = [];
  }
  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        size: 'small',
        title: title,
        message: message,
        isSubmittable: false,
      },
    });
  }
  onSelectClassHandler(classId: number) {
    this.studentForm.get('classId')?.setValue(classId);
    this.studentForm.updateValueAndValidity();
  }
}

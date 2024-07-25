import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ImageDTO } from '../../models/ImageDTO';
import { PermissionService } from '../../service/permission.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PermissionCreateDTO } from '../../models/PermissionCreateDTO';
import { ResponseDTO } from '../../models/ResponseDTO';
import { StudentDTO } from '../../models/StudentDTO';
import { StudentService } from '../../service/student.service';
import { ModalService } from '../../service/modal.service';
import { ImageInputComponent } from '../../components/image-input/image-input.component';
import { ImageCarrouselComponent } from '../../components/image-carrousel/image-carrousel.component';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { UserDataService } from '../../service/user-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-require-license',
  standalone: true,
  imports: [ReactiveFormsModule, ImageInputComponent, ImageCarrouselComponent],
  templateUrl: './require-license.component.html',
  styleUrl: './require-license.component.css',
})
export class RequireLicenseComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  studentList: StudentDTO[];
  images: ImageDTO[] = [];
  todayDate: string;
  tomorrowDate: string;
  permissionForm: FormGroup;
  parentInfo: UserDetailsDTO;
  constructor(
    private permissionService: PermissionService,
    private studentService: StudentService,
    private modalService: ModalService,
    private userDataService: UserDataService
  ) {
    this.todayDate = new Date().toISOString().split('T')[0];
    this.tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    this.permissionForm = new FormGroup({
      startDate: new FormControl(this.todayDate, [Validators.required]),
      endDate: new FormControl(this.todayDate, [Validators.required]),
      reason: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      startHour: new FormControl('08:00', [Validators.required]),
      endHour: new FormControl('09:00', [Validators.required]),
      studentId: new FormControl('-1', [Validators.required]),
    });
    this.studentList = [];
    this.parentInfo = {} as UserDetailsDTO;
  }
  ngOnInit() {
    this.userDataService.currentUser.subscribe({
      next: data => {
        this.parentInfo = data!;
      },
    });
    this.getStudents();
  }
  getStudents() {
    this.studentService
      .getStudentByParentId(this.parentInfo.details.id)
      .subscribe({
        next: (data: ResponseDTO<StudentDTO[]>) => {
          this.studentList = data.content;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
        },
        complete: () => {
          console.log('Complete');
        },
      });
  }
  updateImages(images: ImageDTO[]) {
    console.log(images.length);
    this.images = images;
  }
  onSubmit() {
    console.log(this.images);
    const formData = new FormData();
    this.images.forEach(image => {
      formData.append('images', image.image as Blob);
    });

    const permissionStartDate =
      this.permissionForm.controls['startDate'].value +
      ' ' +
      this.permissionForm.controls['startHour'].value +
      ':00';
    const permissionEndDate =
      this.permissionForm.controls['endDate'].value +
      ' ' +
      this.permissionForm.controls['endHour'].value +
      ':00';
    const permission: PermissionCreateDTO = {
      permissionStartDate: permissionStartDate,
      permissionEndDate: permissionEndDate,
      reason: this.permissionForm.controls['reason'].value,
      date: this.todayDate,
      studentId: this.permissionForm.controls['studentId'].value,
      id: 0,
    };
    formData.append('permission', JSON.stringify(permission));
    this.permissionService.savePermission(formData).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.permissionForm.controls['startDate'].setValue(this.todayDate);
        this.permissionForm.controls['endDate'].setValue(this.todayDate);
        this.permissionForm.controls['reason'].setValue('');
        this.permissionForm.controls['startHour'].setValue('08:00');
        this.permissionForm.controls['endHour'].setValue('09:00');
        this.images = [];
        this.permissionForm.controls['studentId'].setValue('-1');
        this.permissionForm.updateValueAndValidity();
        this.openModal(data.message);
      },
      error: (error: HttpErrorResponse) => {
        this.openModal('Error al registrar el permiso ' + error.message);
      },
    });
  }
  openModal(message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        size: 'small',
        title: 'Registro de Permiso',
        message: message,
        isSubmittable: false,
      },
    });
  }
}

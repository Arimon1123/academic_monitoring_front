import { Component } from '@angular/core';
import { ImageDTO } from '../../models/ImageDTO';
import { v4 as uuid } from 'uuid';
import { PermissionService } from '../../service/permission.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PermissionCreateDTO } from '../../models/PermissionCreateDTO';
import { ResponseDTO } from '../../models/ResponseDTO';
import { StudentDTO } from '../../models/StudentDTO';
import { StudentService } from '../../service/student.service';
import {ParentDTO} from "../../models/ParentDTO";
import {LocalStorageService} from "../../service/local-storage.service";

@Component({
  selector: 'app-require-license',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './require-license.component.html',
  styleUrl: './require-license.component.css'
})
export class RequireLicenseComponent {
  studentList: StudentDTO[] ;
  images: ImageDTO[] = [];
  todayDate: string;
  tomorrowDate: string;
  permissionForm: FormGroup;
  parentInfo: ParentDTO;
  constructor(private permissionService: PermissionService, private studentService: StudentService, private localStorage: LocalStorageService){
    this.todayDate = new Date().toISOString().split('T')[0];
    this.tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    this.permissionForm = new FormGroup({
      startDate: new FormControl(this.todayDate, [Validators.required]),
      endDate: new FormControl(this.todayDate, [Validators.required]),
      reason: new FormControl('', [Validators.required, Validators.minLength(200)]),
      startHour: new FormControl('08:00', [Validators.required]),
      endHour: new FormControl('09:00', [Validators.required]),
      studentId: new FormControl( '-1', [Validators.required])
    });
    this.studentList = [];
    this.parentInfo = JSON.parse(<string> this.localStorage.getItem('roleDetails'));
  }
  ngOnInit(){
    this.getStudents()
  }
  getStudents(){
    this.studentService.getStudentByParentId(this.parentInfo.parentId).subscribe(
      {
        next: (data: ResponseDTO<StudentDTO[]>) => {
          this.studentList = data.content;
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('Complete');
        }
      }
    );
  }
  showImages(event: any) {
    if (event.target.files.length > 0) {
      if ((event.target.files.length > 3) || (this.images.length + event.target.files.length > 3)) {
        alert('No puedes subir mas de 3 imágenes');
        return
      }
      for (let i = 0; i < event.target.files.length; i++) {
        const image = event.target.files[i];
        this.images.push({ image: image, url: this.getImageUrl(image), id: uuid() });
      }
    }
  }
  getImageUrl(image: File) {
    return URL.createObjectURL(image);
  }
  deleteImage(index: string) {
    console.log(index);
    this.images = this.images.filter((image) => image.id !== index);
    console.log(this.images);
  }

  onSubmit() {
    console.log(this.images);
    const formData = new FormData();
    this.images.forEach((image) => {
      formData.append('images', image.image as Blob);
    });

    const permissionStartDate = this.permissionForm.controls['startDate'].value.split('-').reverse().join('-') + ' ' + this.permissionForm.controls['startHour'].value + ':00'
    const permissionEndDate = this.permissionForm.controls['endDate'].value.split('-').reverse().join('-') + ' ' + this.permissionForm.controls['endHour'].value + ':00'
    const permission: PermissionCreateDTO = {
      permissionStartDate: permissionStartDate,
      permissionEndDate: permissionEndDate,
      reason: this.permissionForm.controls['reason'].value,
      date: this.todayDate.split('-').reverse().join('-'),
      studentId: 1,
      id: 0
    }
    formData.append('permission', JSON.stringify(permission));
    this.permissionService.savePermission(formData).subscribe(
      {
        next: (data: ResponseDTO<string>) => {
          alert(data.message);
          this.permissionForm.controls['startDate'].setValue(this.todayDate);
          this.permissionForm.controls['endDate'].setValue(this.todayDate);
          this.permissionForm.controls['reason'].setValue('');
          this.permissionForm.controls['startHour'].setValue('08:00');
          this.permissionForm.controls['endHour'].setValue('09:00');
          this.images = [];
          this.permissionForm.controls['studentId'].setValue('-1');
          this.permissionForm.updateValueAndValidity();
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('Complete');
        }
      }
    );

  }
}

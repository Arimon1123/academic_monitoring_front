import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ParentService } from '../../service/parent.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ParentDTO } from '../../models/ParentDTO';
import { GradeDTO } from '../../models/GradeDTO';
import { GradeService } from '../../service/grade.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassService } from '../../service/class.service';
import { ClassListDTO } from '../../models/ClassListDTO';
import { StudentCreateDTO } from '../../models/StudentCreateDTO';
import { StudentService } from '../../service/student.service';
import {ModalService} from "../../service/modal.service";

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css'
})
export class StudentRegisterComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<any> | undefined;
  minDate = this.calculateMinDate();
  maxDate = this.calculateMaxDate();
  parentList: ParentDTO[] = [];
  selectedParentList: ParentDTO[] = [];
  gradeList: GradeDTO[] = [];
  classList: ClassListDTO[] = [];
  constructor(private parentService: ParentService,
    private gradeService: GradeService,
    private classService: ClassService,
    private studentService: StudentService,
    private modalService: ModalService) { }

  studentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fatherLastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    motherLastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    ci: new FormControl('', [Validators.required, Validators.minLength(3)]),
    birthDate: new FormControl('', [Validators.required]),
    rude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(3)]),
    classId: new FormControl('', [Validators.required]),
    gradeId: new FormControl('-1',),
  });

  parentForm: FormGroup = new FormGroup({
    ci: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  ngOnInit(): void {
    this.gradeService.getAllGrades().subscribe({
      next: (data: ResponseDTO<GradeDTO[]>) => {
        this.gradeList = data.content;
      },
      error: (error: any) => {
        alert('Error al cargar los grados ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }

    });
  }
  searchParents() {
    const ci = this.parentForm.value.ci;
    this.parentService.getParentByCi(ci).subscribe({
      next: (data: ResponseDTO<ParentDTO[]>) => {
        console.log(data.content);
        this.parentList = data.content;
      }
    });
  }

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
      alert('No se puede agregar más padres');
      return;
    }
    if (this.selectedParentList.indexOf(parent) !== -1) {
      alert('El padre ya fue seleccionado');
      return;
    }
    this.selectedParentList.push(parent);
  }
  searchClass($event: any) {
    const gradeId = $event.target.value;
    const year = new Date().getFullYear();
    const shift = 1;
    this.classService.getClassListByGradeIdAndYearAndShift(gradeId, year, shift).subscribe(
      {
        next: (data: ResponseDTO<ClassListDTO[]>) => {
          this.classList = data.content;

        },
        error: (error: any) => {
          alert('Error al cargar las clases ' + error.error.message);
        }
      }
    );
  }
  existsStudentByCi() {
    if (this.studentForm.controls['ci'].errors) {
      return;
    }
    const ci = this.studentForm.value.ci;
    this.studentService.existsStudentByCi(ci).subscribe({
      next: (data: ResponseDTO<boolean>) => {
        if (data.content) {
          this.studentForm.controls['ci'].setErrors({ 'exists': true });
        }
      }
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
          this.studentForm.controls['rude'].setErrors({ 'exists': true });
        }
      }
    });
  }
  removeParent(parentId: number) {
    this.selectedParentList = this.selectedParentList.filter((parent) => parent.id !== parentId);
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
      parentId: [...this.selectedParentList.map((parent) => parent.id)]
    }
    this.studentService.saveStudent(student).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal(data.message);
        this.formReset();
      },
      error: (error: any) => {
        this.openModal('Error al registrar el estudiante ' + error.error.message)
      }
    })
  }
  getErrors() {
    console.log(this.studentForm.controls['ci'].errors);
  }
  formReset() {
    this.studentForm.reset();
    this.selectedParentList = [];
    this.classList = [];
    this.studentForm.controls['gradeId'].setValue('-1');
    this.studentForm.updateValueAndValidity();
    this.parentList = [];
  }
  openModal(message: string){
    this.modalService.open(
      {
        content:this.content!, options: {size: 'small', title: 'Registro de Estudiante', message: message, isSubmittable: false}
      });
  }
}

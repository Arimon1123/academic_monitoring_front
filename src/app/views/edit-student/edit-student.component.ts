import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StudentCardComponent } from '../../components/student-card/student-card.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../service/student.service';
import { StudentDTO } from '../../models/StudentDTO';
import { ParentDTO } from '../../models/ParentDTO';
import { ParentService } from '../../service/parent.service';
import { forkJoin } from 'rxjs';
import { ParentSearchComponent } from '../../components/parent-search/parent-search.component';
import { ModalService } from '../../service/modal.service';
import { ClassSelectComponent } from '../../components/class-select/class-select.component';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [
    StudentCardComponent,
    ReactiveFormsModule,
    ParentSearchComponent,
    ClassSelectComponent,
  ],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css',
})
export class EditStudentComponent implements OnInit {
  @ViewChild('parentModal') modal: TemplateRef<unknown> | undefined;
  studentId: number = 0;
  student: StudentDTO = {} as StudentDTO;
  parents: ParentDTO[] = [];
  showParentSearch = false;
  showClassSelect = false;
  classId: number = 0;
  ngOnInit() {
    this.activeRoute.params.subscribe({
      next: params => {
        this.studentId = params['id'];
        this.getStudentData(this.studentId);
      },
    });
  }
  constructor(
    private activeRoute: ActivatedRoute,
    private studentService: StudentService,
    private parentService: ParentService,
    private modalService: ModalService
  ) {}
  studentForm = new FormGroup({
    name: new FormControl(''),
    fatherLastname: new FormControl(''),
    motherLastname: new FormControl(''),
    birthDate: new FormControl(''),
    ci: new FormControl(''),
    rude: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
  });
  getStudentData(studentId: number) {
    forkJoin({
      student: this.studentService.getStudentById(studentId),
      parents: this.parentService.getParentsByStudentId(studentId),
    }).subscribe({
      next: value => {
        this.student = value.student.content;
        this.parents = value.parents.content;
        this.setFormValue(this.student);
      },
    });
  }
  setFormValue(student: StudentDTO) {
    this.studentForm.setValue({
      name: student.name,
      fatherLastname: student.fatherLastname,
      motherLastname: student.motherLastname,
      birthDate: student.birthDate,
      ci: student.ci,
      rude: student.rude,
      email: student.email,
      address: student.address,
    });
  }
  removeParent(parentId: number) {
    this.parents = this.parents.filter(value => {
      return value.id != parentId;
    });
  }
  addParent(parent: ParentDTO) {
    if (this.parents.length >= 5) {
      alert('No se puede agregar más padres');
      return;
    }
    const father = this.parents.findIndex(value => {
      return value.id === parent.id;
    });
    if (!father) {
      alert('El padre ya fue seleccionado');
      return;
    }
    this.parents.push(parent);
    console.log(this.parents);
  }
  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.modal!,
      options: {
        size: 'small',
        isSubmittable: false,
        title: title,
        message: message,
      },
    });
  }
  toggleParentSearch() {
    this.showParentSearch = !this.showParentSearch;
  }
  toggleClassSelect() {
    this.showClassSelect = !this.showClassSelect;
  }
  onClassSelectHandler(classId: number) {
    this.classId = classId;
  }
  onSubmitPersonalDataFormHandler() {
    const student: StudentDTO = {
      id: this.student.id,
      name: this.studentForm.value.name!,
      fatherLastname: this.studentForm.value.fatherLastname!,
      motherLastname: this.studentForm.value.motherLastname!,
      birthDate: this.studentForm.value.birthDate!,
      ci: this.studentForm.value.ci!,
      rude: this.studentForm.value.rude!,
      email: this.studentForm.value.email!,
      address: this.studentForm.value.address!,
      studentClass: '',
      user: this.student.user,
      parents: this.student.parents,
    };
    this.studentService.updateStudent(student).subscribe({
      next: () => {
        this.getStudentData(this.studentId);
      },
      complete: () => {
        this.openModal(
          'Edición',
          'Datos personales actualizados correctamente'
        );
      },
    });
  }
  onSubmitStudentClassHandler() {
    this.studentService
      .updateStudentClass(this.studentId, this.classId)
      .subscribe({
        complete: () => {
          this.getStudentData(this.studentId);
          this.openModal('Edición', 'Curso actualizado correctamente');
        },
      });
  }
  onSubmitStudentParentHandler() {
    this.studentService
      .updateStudentParents(
        this.studentId,
        this.parents.map(value => value.id)
      )
      .subscribe({
        complete: () => {
          this.getStudentData(this.studentId);
          this.openModal('Edición', 'Padres actualizados correctamente');
        },
      });
  }
}

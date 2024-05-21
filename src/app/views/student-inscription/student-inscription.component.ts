import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ClassSelectComponent } from '../../components/class-select/class-select.component';
import { StudentService } from '../../service/student.service';
import { StudentDTO } from '../../models/StudentDTO';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentCardComponent } from '../../components/student-card/student-card.component';
import { ModalService } from '../../service/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-student-inscription',
  standalone: true,
  imports: [ClassSelectComponent, ReactiveFormsModule, StudentCardComponent],
  templateUrl: './student-inscription.component.html',
  styleUrl: './student-inscription.component.css',
})
export class StudentInscriptionComponent {
  @ViewChild('detailsElement') details: ElementRef | undefined;
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  students: StudentDTO[] = [];
  selectedStudent: StudentDTO | undefined;
  selectedClassId: number = 0;
  searchForm = new FormGroup({
    ci: new FormControl(''),
  });
  constructor(
    private studentService: StudentService,
    private modalService: ModalService
  ) {
    this.searchForm
      .get('ci')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe({
        next: value => {
          console.log(value);

          this.onSubmitSearchStudentHandler();
        },
      });
  }
  onSubmitSearchStudentHandler() {
    const ci = this.searchForm.value?.ci;
    this.studentService.searchStudents({ ci: ci! }).subscribe({
      next: value => {
        this.students = value.content.content;
      },
    });
  }
  onClickSelectStudentHandler(student: StudentDTO) {
    this.details?.nativeElement.removeAttribute('open');
    this.selectedStudent = student;
  }
  onSelectClassHandler(classId: number) {
    this.selectedClassId = classId;
  }

  updateStudentClass() {
    if (!this.selectedStudent) return;
    this.studentService
      .updateStudentClass(this.selectedStudent?.id, this.selectedClassId)
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.openModal('Error en la inscripción', error.error.message);
        },
        complete: () => {
          this.openModal(
            'Inscripción exitosa',
            'La inscripción se realizo con exito'
          );
        },
      });
  }
  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        isSubmittable: false,
        title: title,
        message: message,
        size: 'small',
      },
    });
  }
}

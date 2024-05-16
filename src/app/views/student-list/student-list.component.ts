import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../service/student.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { StudentDTO } from '../../models/StudentDTO';
import { ResponseDTO } from '../../models/ResponseDTO';
import { PageDTO } from '../../models/PageDTO';
import { StudentCardComponent } from '../../components/student-card/student-card.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [ReactiveFormsModule, UserCardComponent, StudentCardComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent {
  studentList: StudentDTO[];
  studentSearchForm: FormGroup;
  requestSend: boolean = false;
  firstRequest: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  constructor(private studentService: StudentService) {
    this.studentList = [];
    this.studentSearchForm = new FormGroup({
      name: new FormControl(''),
      lastname: new FormControl(''),
      ci: new FormControl(''),
      rude: new FormControl(''),
    });
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.studentList = [];
      this.firstRequest = true;
      this.currentPage++;
      this.onSearchSubmitHandler();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.studentList = [];
      this.firstRequest = true;
      this.currentPage--;
      this.onSearchSubmitHandler();
    }
  }

  onSearchSubmitHandler() {
    this.studentService
      .searchStudents(
        this.studentSearchForm.value.name,
        this.studentSearchForm.value.lastname,
        this.studentSearchForm.value.rude,
        this.studentSearchForm.value.rude,
        this.currentPage - 1,
        10
      )
      .subscribe({
        next: (data: ResponseDTO<PageDTO<StudentDTO[]>>) => {
          this.studentList = data.content.content;
          this.totalPages = data.content.totalPages;
          this.currentPage = data.content.number + 1;
          console.log(this.totalPages, this.currentPage);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
}

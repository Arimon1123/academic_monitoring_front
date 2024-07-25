import { Component, OnInit } from '@angular/core';
import { GradesDTO } from '../../models/GradesDTO';
import { GradesService } from '../../service/grades.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { StudentDTO } from '../../models/StudentDTO';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoundPipe } from '../../pipes/RoundPipe';
import { NgClass, NgStyle } from '@angular/common';
import { forkJoin } from 'rxjs';
import { StudentService } from '../../service/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { ClassService } from '../../service/class.service';
import { ClassListDTO } from '../../models/ClassListDTO';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [RouterLink, RoundPipe, NgStyle, NgClass],
  templateUrl: './student-grades.component.html',
  styleUrl: './student-grades.component.css',
})
export class StudentGradesComponent implements OnInit {
  grades: { [key: number]: GradesDTO[] };
  table: {
    subject: string;
    grades: { grade: number; assignationId: number; bimester: number }[];
  }[] = [];
  studentData: StudentDTO;
  currentClass: ClassListDTO | undefined;
  constructor(
    private gradesService: GradesService,
    private activeRoute: ActivatedRoute,
    private studentService: StudentService,
    private configDataService: ConfigurationDataService,
    private classService: ClassService
  ) {
    this.grades = {};
    this.studentData = {} as StudentDTO;
  }
  ngOnInit() {
    this.getConfig();
  }
  getConfig() {
    this.configDataService.currentConfig.subscribe({
      next: value => {
        this.activeRoute.params.subscribe({
          next: params => {
            this.getData(params['id'], value!.currentYear);
          },
        });
      },
    });
  }
  getData(studentId: number, year: number) {
    forkJoin({
      grades: this.gradesService.getGradesByStudentIdAndYear(studentId, year),
      student: this.studentService.getStudentById(studentId),
      currentClass: this.classService.getClassByStudentId(studentId, year),
    }).subscribe({
      next: (data: {
        grades: ResponseDTO<{ [key: number]: GradesDTO[] }>;
        student: ResponseDTO<StudentDTO>;
        currentClass: ResponseDTO<ClassListDTO>;
      }) => {
        this.grades = data.grades.content;
        this.currentClass = data.currentClass.content;
        this.table = this.buildTable(this.grades);
        this.studentData = data.student.content;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
  buildTable(grades: { [key: number]: GradesDTO[] }) {
    const table: {
      subject: string;
      grades: { grade: number; assignationId: number; bimester: number }[];
    }[] = [];
    for (const key in grades) {
      const subjectGrades: {
        grade: number;
        bimester: number;
        assignationId: number;
      }[] = [];
      let finalGrade = 0;
      for (let i = 0; i < grades[key].length; i++) {
        const grade = grades[key][i];
        finalGrade += grade.total_grade;
        subjectGrades.push({
          grade: grade.total_grade,
          bimester: grade.bimester,
          assignationId: grade.assignation_Id,
        });
      }
      if (grades[key].length < 4) {
        for (let i = grades[key].length; i < 4; i++) {
          subjectGrades.push({
            grade: 0,
            bimester: i + 1,
            assignationId: 0,
          });
        }
      }
      subjectGrades.push({
        grade: Math.ceil(finalGrade / 4),
        bimester: 0,
        assignationId: 0,
      });
      table.push({
        subject: grades[key][0].subject_Name,
        grades: subjectGrades,
      });
    }
    return table;
  }
}

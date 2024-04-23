import {Component, OnInit} from '@angular/core';
import {GradesDTO} from "../../models/GradesDTO";
import {GradesService} from "../../service/grades.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {StudentDTO} from "../../models/StudentDTO";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {RoundPipe} from "../../pipes/RoundPipe";
import {NgClass, NgStyle} from "@angular/common";
import {forkJoin} from "rxjs";
import {StudentService} from "../../service/student.service";

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [
    RouterLink,
    RoundPipe,
    NgStyle,
    NgClass
  ],
  templateUrl: './student-grades.component.html',
  styleUrl: './student-grades.component.css'
})
export class StudentGradesComponent implements OnInit{
  grades: {[key: number]: GradesDTO[] };
  table : any[] = [];
  studentData : StudentDTO;
  constructor(private gradesService: GradesService,
              private activeRoute: ActivatedRoute,
              private studentService: StudentService) {
    this.grades = {};
    this.studentData = {} as StudentDTO;
  }
  ngOnInit() {
    this.activeRoute.params.subscribe({
      next: (params) => {
        this.getData(params['id'],new Date().getFullYear());
      }
    })
  }
  getData(studentId: number, year: number){
    forkJoin({
      grades: this.gradesService.getGradesByStudentIdAndYear(studentId, year),
      student: this.studentService.getStudentById(studentId)
    }).subscribe({
      next: (data: {grades: ResponseDTO<{[key: number]: GradesDTO[] }>, student: ResponseDTO<StudentDTO>}) => {
        this.grades = data.grades.content;
        this.table = this.buildTable(this.grades);
        this.studentData = data.student.content;
      },
      error: (error: any) => {
        console.error(error);
      }

    })
  }
  buildTable(grades:{[key: number]: GradesDTO[] } ){
    let table: {subject: string, grades: {grade:number,assignationId:number,bimester:number } []}[] = [];
    for(let key in grades){
      let subjectGrades: { grade: number, bimester: number, assignationId: number }[] = [];
      let notaFinal = 0;
      for(let i = 0; i < grades[key].length; i++){
        const grade = grades[key][i];
        notaFinal += grade.total_grade;
        subjectGrades.push({grade: grade.total_grade,bimester:grade.bimester,assignationId: grade.assignation_Id});
      }
      subjectGrades.push({grade: notaFinal/grades[key].length,bimester:0,assignationId:0});
      table.push({subject: grades[key][0].subject_Name, grades: subjectGrades});
    }
    return table;
  }
}

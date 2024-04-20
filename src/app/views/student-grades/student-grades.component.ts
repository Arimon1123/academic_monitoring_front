import {Component, OnInit} from '@angular/core';
import {GradesDTO} from "../../models/GradesDTO";
import {GradesService} from "../../service/grades.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {StudentDTO} from "../../models/StudentDTO";
import {RouterLink} from "@angular/router";
import {RoundPipe} from "../../pipes/RoundPipe";
import {NgClass, NgStyle} from "@angular/common";

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
  constructor(private gradesService: GradesService) {
    this.grades = {};
    this.studentData = { "id": 13,
      "name": "Trueman",
      "ci": "179-94-9723",
      "fatherLastname": "Deyes",
      "motherLastname": "Paybody",
      "birthDate": "2009-05-07",
      "address": "73 Pankratz Center",
      "rude": "820-32-9193",
      "studentClass": "1°Primaria A"} as StudentDTO;
  }
  ngOnInit() {
    this.getGrades(13,2024)
  }

  getGrades(studentId: number, year: number){
    this.gradesService.getGradesByStudentIdAndYear(studentId, year).subscribe({
      next: (data: ResponseDTO<{[key: number]: GradesDTO[] }>) => {
        this.grades = data.content;
        this.table = this.buildTable(this.grades);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
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

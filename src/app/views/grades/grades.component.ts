import { Component } from '@angular/core';
import {AssignationDTO} from "../../models/AssignationDTO";
import {LocalStorageService} from "../../service/local-storage.service";
import {StudentDTO} from "../../models/StudentDTO";
import {StudentService} from "../../service/student.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {ActivityDTO} from "../../models/ActivityDTO";
import {ActivityService} from "../../service/activity.service";
import {GradesService} from "../../service/grades.service";
import {ActivityGradeDTO} from "../../models/ActivityGradeDTO";
import {forkJoin} from "rxjs";
import * as uuid from 'uuid';
import {DecimalPipe, NgClass} from "@angular/common";
import {RoundPipe} from "../../pipes/RoundPipe";
@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [
    DecimalPipe,
    RoundPipe,
    NgClass
  ],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {
  assignation: AssignationDTO;
  students : StudentDTO[];
  activities: ActivityDTO[];
  grades:{[key:number]:ActivityGradeDTO[]};
  table : {student:StudentDTO, grades: ActivityGradeDTO[]}[];
  constructor(private localStorage: LocalStorageService,
              private studentService: StudentService,
              private activityService: ActivityService,
              private gradesService: GradesService) {
    this.assignation = JSON.parse(this.localStorage.getItem('assignation') as string)
    this.students = [];
    this.activities = [];
    this.grades = [];
    this.table = [];
  }
  ngOnInit(){
    forkJoin({
      activities: this.activityService.getActivitiesByAssignationId(this.assignation.id),
      students: this.studentService.getStudentsByAssignationId(this.assignation.id),
      grades: this.gradesService.getGradesByAssignation(this.assignation.id)
    }).subscribe(
      {
        next: (data : {activities: ResponseDTO<ActivityDTO[]>, students: ResponseDTO<StudentDTO[]>, grades: ResponseDTO<{[key:number]:ActivityGradeDTO[]} >})=>{
          this.activities = data.activities.content;
          this.students = data.students.content;
          this.grades = data.grades.content;
          this.buildTable();
        }
      }
    )
  }
  buildTable(){
    for(let student of this.students){
      let grades: {student: StudentDTO, grades: ActivityGradeDTO[]} = { student: student , grades : []}
      let finalGrade = 0;
      for( let activity of this.activities){
        const grade = this.grades[student.id] ? this.grades[student.id].find((grade) => grade.activityId === activity.id) : undefined;
        if(grade){
          grades.grades.push(grade);
          finalGrade += activity.value * (grade!.grade/100);
        }
        else {
          grades.grades.push({id: 0 , studentId: student.id, activityId: activity.id, grade: 0})
        }

      }
      grades.grades.push({id:0, studentId:0 , grade: finalGrade, activityId: 0})
      this.table.push(grades)
    }
    console.log(this.table)
  }
  saveGrades(){
    let grades: ActivityGradeDTO[] = [];
    for(let student of this.table){
      for(let grade of student.grades){
        if(!(grade.activityId === 0)){
          grades.push(grade);
        }
      }
    }
    this.gradesService.saveGradesBy(grades).subscribe(
      {
        next: (data: ResponseDTO<string>) => {
          alert(data.message);
        }
      }
    )
  }
  updateGrade(event:any, activity: ActivityGradeDTO, index: number){
    const grade = parseInt(event.target.value);
    if(grade > 100 || grade < 0){
      alert("La calificación debe ser entre 0 y 100");
      event.target.value = 0;
      return;
    }
    activity.grade = parseInt(event.target.value);
    const tableRow = this.table[index];
    let finalGrade = 0;
    for(let grade of tableRow.grades){
      if(grade.activityId !== 0){
        finalGrade += this.activities.find((activity) => activity.id === grade.activityId)!.value/100 *grade.grade;
        console.log(finalGrade)
      }
    }
    tableRow.grades[this.activities.length].grade = finalGrade;
  }

  protected readonly scroll = scroll;
}

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
import {DecimalPipe} from "@angular/common";
import {RoundPipe} from "../../pipes/RoundPipe";
@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [
    DecimalPipe,
    RoundPipe
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
  getStudents(){
    this.studentService.getStudentsByAssignationId(this.assignation.id).subscribe(
      {
        next: (data : ResponseDTO<StudentDTO[]>)=>{
          this.students = data.content;
        },
      });
  }
  getActivities(){
    this.activityService.getActivitiesByAssignationId(this.assignation.id).subscribe({
      next: (data: ResponseDTO<ActivityDTO[]>) => {
        this.activities = data.content;
      }
    });
  }
  getGrades(){
    this.gradesService.getGradesByAssignation(this.assignation.id).subscribe(
      {
        next: (data:ResponseDTO<{[key:number]:ActivityGradeDTO[]}>)=>{
          this.grades = data.content;
        }
      });
  }
  buildTable(){
    for(let student of this.students){
      let grades: {student: StudentDTO, grades: ActivityGradeDTO[]} = { student: student , grades : []}
      let finalGrade = 0;
      for( let activity of this.activities){
        const grade = this.grades[student.id].find((grade)=>{ return grade.activityId === activity.id})
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
}

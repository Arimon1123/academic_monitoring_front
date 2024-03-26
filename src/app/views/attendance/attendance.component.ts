import {Component, OnInit} from '@angular/core';
import {StudentDTO} from "../../models/StudentDTO";
import {PermissionDTO} from "../../models/PermissionDTO";
import {AttendanceService} from "../../service/attendance.service";
import {PermissionService} from "../../service/permission.service";
import {StudentService} from "../../service/student.service";
import {AssignationDTO} from "../../models/AssignationDTO";
import {LocalStorageService} from "../../service/local-storage.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {AttendanceDTO} from "../../models/AttendanceDTO";
import {forkJoin, tap} from "rxjs";
import {DatePipe, NgClass} from "@angular/common";
import {AttendanceListDTO} from "../../models/AttendanceListDTO";

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit{
  studentList : StudentDTO[];
  permissionList : PermissionDTO[];
  assignationDTO: AssignationDTO;
  attendanceDTO:AttendanceDTO[];
  table : AttendanceListDTO[] = [];
  weekdays: any;
  todayDate : Date;
  constructor(private attendanceService: AttendanceService,
              private permissionService: PermissionService,
              private studentService: StudentService,
              private localStorage: LocalStorageService){
    this.todayDate = new Date( new Date().getFullYear()+"-"+ (new Date().getMonth()+1) +"-"+new Date().getDate());
    this.studentList = [];
    this.permissionList = [];
    this.attendanceDTO = [];
    this.weekdays = {
      "monday":1,
      'tuesday':2,
      'wednesday':3,
      'thursday':4,
      'friday':5,
    }
    this.assignationDTO = {
      "id": 1,
      "className": "1°Primaria A",
      "teacherName": "Teacher Teacher",
      "subjectName": "Matemática",
      "classroomName": "Aula A-1",
      "schedule": [
        {
          "id": 1,
          "weekday": "monday",
          "startTime": "08:00:00",
          "endTime": "08:45:00",
          "period": 1
        },
        {
          "id": 2,
          "weekday": "thursday",
          "startTime": "08:45:00",
          "endTime": "09:30:00",
          "period": 1
        }
      ]
    }
   // this.assignationDTO = JSON.parse(this.localStorage.getItem('assignation') as string);
  }
  ngOnInit() {
   this.getAllLists()

  }
  getAllLists(){
    forkJoin(
      {
        students :this.studentService.getStudentsByAssignationId(this.assignationDTO.id),
        attendance: this.attendanceService.getAttendanceByAssignationId(this.assignationDTO.id),
        permissions: this.permissionService.getPermissionsByClassId(this.assignationDTO.id)
      }
    ).subscribe({
      next:(data)=>{
        this.studentList = data.students.content;
        this.attendanceDTO = data.attendance.content.map((attendance: AttendanceDTO)=>{
          console.log(attendance.date)
          attendance.date = new Date( attendance.date + " 00:00:0000")
          console.log(attendance.date)
          return attendance
        });
        this.permissionList = data.permissions.content;
        this.buildTable()
      }
    })
  }
  buildTable(){
    let table: any[] = [];
    for(let student of this.studentList){
       let attendance = this.attendanceDTO.filter((attendance ) => {
         return attendance.studentId === student.id;
       })
        table.push({student: student, attendance: attendance})
    }
    this.table = table;
  }
  addNewAttendanceDay(){
    const lastAttendance = this.table[0].attendance[0] ? this.table[0].attendance[0] : {date: new Date(0)}
    console.log(lastAttendance.date , this.todayDate);
    const weekdayControl =
      this.assignationDTO.schedule.find((schedule) => this.weekdays[schedule.weekday] === this.todayDate.getDay()+1);
    console.log(weekdayControl);
    if(lastAttendance.date.toDateString() !== this.todayDate.toDateString() ) {
      this.table.map((row) => {
        let attendance = row.attendance;
        const permission = this.permissionList.find((permission)=> permission.student.id === row.student.id )
        if(permission){
          attendance.unshift({id: 0, attendance: 3, date: this.todayDate, assignationId: this.assignationDTO.id, studentId: row.student.id})
        }else{
          attendance.unshift({id: 0, attendance: -1, date: this.todayDate, assignationId: this.assignationDTO.id, studentId: row.student.id})
        }
        return {student: row.student, attendance: attendance}
      })
    }else{
      alert('ya se agrego la asistencia para hoy');
      return
    }
  }
  toggleAttendance(attendance: AttendanceDTO){
    if(attendance.date.toLocaleDateString() !== this.todayDate.toLocaleDateString())
      return;
    switch (attendance.attendance){
      case 1: attendance.attendance = 2; break;
      case 2: attendance.attendance = 1; break;
      case -1: attendance.attendance =1; break;
      case 3: break;
      default: attendance.attendance = 1; break;
    }
  }
  submit(){
    let attendance: AttendanceDTO[] = []
    for(let day of this.table){
      attendance = [...attendance,...day.attendance]
    }
    console.log(attendance)
    this.attendanceService.saveAllAttendance(attendance).subscribe({
      next:(data:ResponseDTO<string>)=>{
        alert(data.message);
      }
    })
  }
}

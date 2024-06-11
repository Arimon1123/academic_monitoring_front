import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StudentDTO } from '../../models/StudentDTO';
import { PermissionDTO } from '../../models/PermissionDTO';
import { AttendanceService } from '../../service/attendance.service';
import { PermissionService } from '../../service/permission.service';
import { StudentService } from '../../service/student.service';
import { AssignationDTO } from '../../models/AssignationDTO';
import { ResponseDTO } from '../../models/ResponseDTO';
import { AttendanceDTO } from '../../models/AttendanceDTO';
import { forkJoin } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';
import { AttendanceListDTO } from '../../models/AttendanceListDTO';
import { AttendanceDateDTO } from '../../models/AttendanceDateDTO';
import { ModalService } from '../../service/modal.service';
import { ActivatedRoute } from '@angular/router';
import { AssignationService } from '../../service/assignation.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  studentList: StudentDTO[];
  permissionList: PermissionDTO[];
  assignationDTO: AssignationDTO;
  attendanceDTO: AttendanceDTO[];
  table: AttendanceListDTO[] = [];
  weekdays: { [key: string]: number };
  todayDate: Date;
  attendanceDates: AttendanceDateDTO[];
  charDict: { [key: number]: string } = {
    1: '✔',
    2: '✘',
    3: 'Lic.',
    4: '-',
    0: '•',
  };
  constructor(
    private attendanceService: AttendanceService,
    private permissionService: PermissionService,
    private studentService: StudentService,
    private modalService: ModalService,
    private activeRoute: ActivatedRoute,
    private assignationService: AssignationService
  ) {
    this.todayDate = new Date(
      new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1) +
        '-' +
        new Date().getDate()
    );
    this.studentList = [];
    this.permissionList = [];
    this.attendanceDTO = [];
    this.attendanceDates = [];
    this.weekdays = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
    };
    this.assignationDTO = {} as AssignationDTO;
  }
  ngOnInit() {
    this.activeRoute.params.subscribe({
      next: data => {
        this.getAllLists(data['id']);
      },
    });
  }
  getAllLists(assignationId: number = 0) {
    forkJoin({
      students: this.studentService.getStudentsByAssignationId(assignationId),
      attendance:
        this.attendanceService.getAttendanceByAssignationId(assignationId),
      permissions:
        this.permissionService.getPermissionsByClassId(assignationId),
      dates:
        this.attendanceService.getAttendanceDatesByAssignationId(assignationId),
      assignation: this.assignationService.getAssignationById(assignationId),
    }).subscribe({
      next: data => {
        this.studentList = data.students.content;
        this.attendanceDTO = data.attendance.content.map(
          (attendance: AttendanceDTO) => {
            attendance.date = new Date(attendance.date + ' 00:00:0000');
            return attendance;
          }
        );
        console.log(this.attendanceDTO.length);
        this.permissionList = data.permissions.content;
        this.attendanceDates = data.dates.content.map(
          (attendanceDate: AttendanceDateDTO) => {
            attendanceDate.date = new Date(attendanceDate.date + ' 00:00:0000');
            return attendanceDate;
          }
        );
        this.assignationDTO = data.assignation.content;
        this.buildTable();
      },
    });
  }
  buildTable() {
    const table: { student: StudentDTO; attendance: AttendanceDTO[] }[] = [];
    for (const student of this.studentList) {
      let attendance = this.attendanceDTO.filter(attendance => {
        return attendance.studentId === student.id;
      });
      if (attendance.length === 0 && this.attendanceDates.length > 0) {
        attendance = this.attendanceDates.map(attendanceDate => {
          return {
            id: 0,
            attendance: 4,
            date: attendanceDate.date,
            assignationId: this.assignationDTO.id,
            studentId: student.id,
          };
        });
      }
      if (attendance.length < this.attendanceDates.length) {
        const missingDates = this.attendanceDates.filter(attendanceDate => {
          return !attendance.find(
            attendance =>
              attendance.date.toLocaleDateString() ===
              attendanceDate.date.toLocaleDateString()
          );
        });
        missingDates.map(attendanceDate => {
          attendance.push({
            id: 0,
            attendance: 4,
            date: attendanceDate.date,
            assignationId: this.assignationDTO.id,
            studentId: student.id,
          });
        });
      }
      table.push({ student: student, attendance: attendance });
    }
    this.table = table;
  }

  addNewAttendanceDay() {
    const lastAttendance = this.attendanceDates[0];
    console.log(this.todayDate.getDay() + 1);
    const weekdayControl = this.assignationDTO.schedule.find(
      schedule => this.weekdays[schedule.weekday] === this.todayDate.getDay()
    );
    if (!weekdayControl) {
      this.openModal('No hay clases', 'El día de hoy no hay clases');
      return;
    }
    if (
      !lastAttendance ||
      lastAttendance.date.toDateString() !== this.todayDate.toDateString()
    ) {
      this.attendanceDates.unshift({ id: 0, date: this.todayDate });
      this.table.map(row => {
        const attendance = row.attendance;
        const permission = this.permissionList.find(
          permission => permission.student.id === row.student.id
        );
        if (permission) {
          attendance.unshift({
            id: 0,
            attendance: 3,
            date: this.todayDate,
            assignationId: this.assignationDTO.id,
            studentId: row.student.id,
          });
        } else {
          attendance.unshift({
            id: 0,
            attendance: 0,
            date: this.todayDate,
            assignationId: this.assignationDTO.id,
            studentId: row.student.id,
          });
        }
        return { student: row.student, attendance: attendance };
      });
    } else {
      this.openModal('Error', 'Ya se ha registrado la asistencia de hoy');
      return;
    }
  }
  toggleAttendance(attendance: AttendanceDTO) {
    console.log(attendance);
    if (
      attendance.date.toLocaleDateString() !==
      this.todayDate.toLocaleDateString()
    )
      return;
    switch (attendance.attendance) {
      case 1:
        attendance.attendance = 2;
        break;
      case 2:
        attendance.attendance = 1;
        break;
      case 0:
        attendance.attendance = 1;
        break;
      case 3:
        break;
      case 4:
        attendance.attendance = 1;
        break;
      default:
        attendance.attendance = 1;
        break;
    }
  }
  submit() {
    let attendance: AttendanceDTO[] = [];
    for (const day of this.table) {
      attendance = [...attendance, ...day.attendance];
    }
    console.log(attendance);
    this.attendanceService.saveAllAttendance(attendance).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Asistencia Guardada', data.message);
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
      },
    });
  }
}

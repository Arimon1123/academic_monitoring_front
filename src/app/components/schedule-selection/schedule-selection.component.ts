import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduleDTO } from '../../models/ScheduleDTO';
import { TeacherDTO } from '../../models/TeacherDTO';
import { ClassroomDTO } from '../../models/ClassroomDTO';
import { ScheduleService } from '../../service/schedule.service';
import { forkJoin } from 'rxjs';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ScheduleCreateDTO } from '../../models/ScheduleCreateDTO';
import { PeriodDTO } from '../../models/PeriodDTO';
import { schedule } from '../../consts/schedule.json';
import { SubjectDTO } from '../../models/SubjectDTO';
import { NgClass } from '@angular/common';
import { ClassListDTO } from '../../models/ClassListDTO';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-schedule-selection',
  standalone: true,
  imports: [NgClass],
  templateUrl: './schedule-selection.component.html',
  styleUrl: './schedule-selection.component.css',
})
export class ScheduleSelectionComponent implements OnInit {
  @Output() scheduleEventEmitter = new EventEmitter<ScheduleDTO[]>();
  @Input() teacherData?: TeacherDTO = {
    id: 1,
    person: {
      id: 3,
      name: 'Teacher',
      lastname: 'Teacher',
      ci: '12345678',
      address: 'Calle 1',
      email: 'q1231231@gmail.com',
      phone: '1831092831',
    },
    academicEmail: '',
    subjects: [
      {
        id: 1,
        name: 'Matemática',
        hours: 2,
        status: 1,
        gradeName: 'Primero',
        section: 'Primaria',
        gradeId: 1,
        requirements: [
          {
            id: 1,
            requirement: 'Pizarrón Interactivo',
            description: 'Superficie táctil para proyecciones digitales.',
          },
          {
            id: 4,
            requirement: 'Escritorios o mesas individuales',
            description: 'Superficies de trabajo individuales.',
          },
        ],
      },
    ],
  };
  selectedSchedules: ScheduleDTO[] = [];
  @Input() classData?: ClassListDTO;
  @Input() classRoomData?: ClassroomDTO;
  @Input() isForAssignation = false;
  @Input() selectedSubject?: SubjectDTO;
  showedSchedule: ScheduleCreateDTO[][] = [];
  teacherSchedules: ScheduleDTO[] = [];
  classSchedules: ScheduleDTO[] = [];
  classroomSchedules: ScheduleDTO[] = [];
  schedule: { [key: string]: ScheduleCreateDTO[] } = {};
  hours: PeriodDTO[] = schedule[0].hours;
  days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  ngOnInit() {
    if (this.isForAssignation) this.getAllSchedules();
    else this.getTeacherSchedules();
  }
  constructor(private scheduleService: ScheduleService) {}
  getAllSchedules() {
    forkJoin({
      schedule: this.scheduleService.getScheduleByTeacher(
        <number>this.teacherData?.id
      ),
      classSchedule: this.scheduleService.getScheduleByClass(
        <number>this.classData?.id
      ),
      classroomSchedule: this.scheduleService.getScheduleByClassroom(
        <number>this.classRoomData?.id
      ),
      selectedSchedules:
        this.classData?.id && this.selectedSubject?.id
          ? this.scheduleService.getScheduleBySubjectAndClassId(
              this.classData?.id,
              this.selectedSubject?.id
            )
          : [],
    }).subscribe({
      next: (data: {
        schedule: ResponseDTO<ScheduleDTO[]>;
        classSchedule: ResponseDTO<ScheduleDTO[]>;
        classroomSchedule: ResponseDTO<ScheduleDTO[]>;
        selectedSchedules: ResponseDTO<ScheduleDTO[]>;
      }) => {
        this.teacherSchedules = data.schedule.content;
        this.classSchedules = data.classSchedule.content;
        this.classroomSchedules = data.classroomSchedule.content;
        this.selectedSchedules = data.selectedSchedules.content;
        this.composeSchedule();
        console.log(
          this.teacherSchedules,
          this.classSchedules,
          this.classroomSchedules,
          this.selectedSchedules
        );
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }
  composeSchedule() {
    this.schedule = {
      monday: structuredClone(this.hours),
      tuesday: structuredClone(this.hours),
      wednesday: structuredClone(this.hours),
      thursday: structuredClone(this.hours),
      friday: structuredClone(this.hours),
    };
    for (const schedule of this.teacherSchedules) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'teacher';
    }
    for (const schedule of this.classSchedules) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'class';
    }
    for (const schedule of this.classroomSchedules) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'classroom';
    }
    for (const schedule of this.selectedSchedules!) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'selected';
    }

    this.showedSchedule = this.transformSchedule();
    //this.showSchedule = true;
  }
  transformSchedule() {
    const schedule: ScheduleCreateDTO[][] = [];
    for (let i = 0; i < 7; i++) {
      const transformedDay = [];
      for (const day of this.days) {
        transformedDay.push(this.schedule[day][i]);
      }
      schedule.push(transformedDay);
    }
    console.log(schedule);
    return schedule;
  }

  selectSchedule(schedule: ScheduleCreateDTO, dayIndex: number) {
    if (!schedule.isAvailable && schedule.reason !== 'selected') {
      alert('Horario No disponible');
      return;
    }
    const newSchedule = {
      id: null,
      startTime: schedule.start,
      endTime: schedule.end,
      weekday: this.days[dayIndex],
      period: schedule.period,
    };
    if (!schedule.isAvailable) {
      schedule.reason = 'none';
      this.selectedSchedules = this.selectedSchedules?.filter(
        s =>
          s.period !== newSchedule.period || s.weekday !== newSchedule.weekday
      );
    } else {
      if (this.isForAssignation) {
        if (this.selectedSubject!.hours <= this.selectedSchedules!.length) {
          alert('No puede seleccionar más horas de las permitidas');
          return;
        }
      }
      schedule.reason = 'selected';
      this.selectedSchedules?.push(newSchedule);
    }
    schedule.isAvailable = !schedule.isAvailable;
    this.scheduleEventEmitter.emit(this.selectedSchedules);
    console.log(this.selectedSchedules);
  }
  getTeacherSchedules() {
    forkJoin({
      teacherSchedule: this.scheduleService.getScheduleByTeacher(
        <number>this.teacherData?.id
      ),
      teacherConsultHours: this.scheduleService.getTeacherConsultHours(
        <number>this.teacherData?.id
      ),
    }).subscribe({
      next: (data: {
        teacherSchedule: ResponseDTO<ScheduleDTO[]>;
        teacherConsultHours: ResponseDTO<ScheduleDTO[]>;
      }) => {
        this.teacherSchedules = data.teacherSchedule.content;
        this.selectedSchedules = data.teacherConsultHours.content;
        this.composeSchedule();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
      },
    });
  }

  getCellClasses(period: ScheduleCreateDTO) {
    return {
      'bg-red-500': !period.isAvailable && period.reason !== 'selected',
      'bg-green-500': period.isAvailable,
      'bg-blue-500': !period.isAvailable && period.reason === 'selected',
    };
  }
}

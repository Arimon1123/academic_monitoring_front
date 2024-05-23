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
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';

@Component({
  selector: 'app-schedule-selection',
  standalone: true,
  imports: [NgClass],
  templateUrl: './schedule-selection.component.html',
  styleUrl: './schedule-selection.component.css',
})
export class ScheduleSelectionComponent implements OnInit {
  @Output() scheduleEventEmitter = new EventEmitter<ScheduleDTO[]>();
  @Input() teacherData?: TeacherDTO = {} as TeacherDTO;

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
  configuration: ConfigurationDTO = {} as ConfigurationDTO;
  ngOnInit() {
    this.getConfiguration();
  }
  constructor(
    private scheduleService: ScheduleService,
    private configDataService: ConfigurationDataService
  ) {}
  getConfiguration() {
    this.configDataService.currentConfig.subscribe({
      next: value => {
        this.configuration = value!;
      },
    });
    setTimeout(() => {
      if (this.isForAssignation) {
        this.getAllSchedules();
        console.log('assignation');
      } else this.getTeacherSchedules();
    }, 1000);
  }
  getAllSchedules() {
    forkJoin({
      schedule: this.scheduleService.getScheduleByTeacher(
        <number>this.teacherData?.id,
        this.configuration.currentYear
      ),
      classSchedule: this.scheduleService.getScheduleByClass(
        <number>this.classData?.id
      ),
      classroomSchedule: this.scheduleService.getScheduleByClassroom(
        <number>this.classRoomData?.id,
        this.configuration.currentYear
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
      complete: () => {
        this.composeSchedule();
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
      console.log('teacher');
    }
    for (const schedule of this.classSchedules) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'class';
      console.log('class');
    }
    for (const schedule of this.classroomSchedules) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'classroom';
      console.log('classroom');
    }
    for (const schedule of this.selectedSchedules!) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'selected';
    }

    this.showedSchedule = this.transformSchedule();
    console.log(this.schedule);
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
        <number>this.teacherData?.id,
        this.configuration.currentYear
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

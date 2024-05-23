import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ResponseDTO } from '../../models/ResponseDTO';
import { AssignationService } from '../../service/assignation.service';
import { AssignationDTO } from '../../models/AssignationDTO';
import { schedule } from '../../consts/schedule.json';
import { ModalService } from '../../service/modal.service';
import { ScheduleAssignationDTO } from '../../models/ScheduleAssignationDTO';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { HourPipe } from '../../pipes/HourPipe';
import { colors } from '../../consts/colors.json';
import { UserDataService } from '../../service/user-data.service';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';
import { ConfigurationDataService } from '../../service/configuration-data.service';

@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [DatePipe, HourPipe, NgClass, NgStyle],
  templateUrl: './teacher-schedule.component.html',
  styleUrl: './teacher-schedule.component.css',
})
export class TeacherScheduleComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<ScheduleAssignationDTO> | undefined;
  userDetails: UserDetailsDTO;
  schedule: AssignationDTO[] = [];
  table: ScheduleAssignationDTO[][] = [];
  selectedClass: ScheduleAssignationDTO;
  assignedColors: { [key: string]: string };
  weekdays: { [key: string]: number } = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
  };
  config: ConfigurationDTO = {} as ConfigurationDTO;
  scheduleFormat = schedule[0];
  constructor(
    private assignationService: AssignationService,
    private userDataService: UserDataService,
    private modalService: ModalService,
    private confDataService: ConfigurationDataService
  ) {
    this.userDetails = {} as UserDetailsDTO;
    this.selectedClass = {} as ScheduleAssignationDTO;
    this.assignedColors = {};
  }

  ngOnInit() {
    this.confDataService.currentConfig.subscribe({
      next: value => {
        this.config = value!;
        this.userDataService.currentUser.subscribe({
          next: user => {
            this.userDetails = user!;
            this.getSchedule();
          },
        });
      },
    });
  }
  assignColors() {
    let i = 0;
    for (const assignation of this.schedule) {
      if (!(assignation.subjectName in this.assignedColors)) {
        this.assignedColors[assignation.subjectName] = colors[i];
      }
      i = (i + 1) % colors.length;
    }
  }
  getSchedule() {
    this.assignationService
      .getAssignationByTeacherId(
        this.userDetails.details.id,
        this.config.currentYear
      )
      .subscribe({
        next: (data: ResponseDTO<AssignationDTO[]>) => {
          this.schedule = data.content;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
        },
        complete: () => {
          this.table = this.buildSchedule();
          this.assignColors();
        },
      });
  }
  buildSchedule() {
    const table = [];
    for (let row = 0; row < 7; row++) {
      let col: ScheduleAssignationDTO[] = [];
      col = new Array(5).fill({
        id: 0,
        subjectName: '',
        classroomName: '',
        className: '',
        weekday: '',
        startHour: '',
        endHour: '',
        period: 0,
      });
      table.push(col);
    }
    for (const assignation of this.schedule) {
      for (const scheduleDat of assignation.schedule) {
        const day = this.weekdays[scheduleDat.weekday];
        table[scheduleDat.period - 1][day] = {
          id: assignation.id,
          subjectName: assignation.subjectName,
          classroomName: assignation.classroomName,
          className: assignation.className,
          weekday: scheduleDat.weekday,
          startHour: scheduleDat.startTime,
          endHour: scheduleDat.endTime,
          period: scheduleDat.period,
        } as ScheduleAssignationDTO;
      }
    }
    return table;
  }
  selectClass(selectedClass: ScheduleAssignationDTO) {
    if (selectedClass.id === 0) return;
    this.selectedClass = selectedClass;
    this.openModal();
  }
  openModal() {
    this.modalService.open({
      content: this.content!,
      options: {
        data: this.selectedClass,
        size: 'small',
        title: 'Horario de Clase',
        message: '',
        isSubmittable: false,
        hasContent: true,
      },
    });
  }
}

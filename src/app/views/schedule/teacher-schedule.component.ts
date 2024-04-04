import {Component, TemplateRef, ViewChild} from '@angular/core';
import {LocalStorageService} from "../../service/local-storage.service";
import {UserDTO} from "../../models/UserDTO";
import {TeacherDTO} from "../../models/TeacherDTO";
import {ResponseDTO} from "../../models/ResponseDTO";
import {AssignationService} from "../../service/assignation.service";
import {AssignationDTO} from "../../models/AssignationDTO";
import {schedule} from "../../consts/schedule.json"
import {ModalService} from "../../service/modal.service";
import {ScheduleAssignationDTO} from "../../models/ScheduleAssignationDTO";
import {DatePipe, NgClass, NgStyle} from "@angular/common";
import {HourPipe} from "../../pipes/HourPipe";
import {colors} from "../../consts/colors.json";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    DatePipe,
    HourPipe,
    NgClass,
    NgStyle
  ],
  templateUrl: './teacher-schedule.component.html',
  styleUrl: './teacher-schedule.component.css'
})
export class TeacherScheduleComponent {
  @ViewChild('modal') content : TemplateRef<ScheduleAssignationDTO> | undefined;
  userDetails: UserDTO;
  roleDetails: TeacherDTO;
  schedule: AssignationDTO[] = [];
  table : ScheduleAssignationDTO[][] = [];
  selectedClass: ScheduleAssignationDTO;
  assignedColors : {[key: string]: string } ;
  weekdays: { [key: string]: number } = {
    'monday': 0,
    'tuesday': 1,
    'wednesday': 2,
    'thursday': 3,
    'friday': 4,
    'saturday': 5,
  }
  scheduleFormat: any;
  constructor(private assignationService: AssignationService,
              private localStorage: LocalStorageService,
              private modalService: ModalService) {
    this.userDetails = {} as UserDTO;
    this.roleDetails = {} as TeacherDTO;
    this.selectedClass = {} as ScheduleAssignationDTO;
    this.assignedColors = {} ;
    this.scheduleFormat = schedule[0];
  }

  ngOnInit() {
    this.userDetails = JSON.parse(this.localStorage.getItem('userDetails') as string);
    this.roleDetails = JSON.parse(this.localStorage.getItem('roleDetails') as string);
    this.getSchedule();
  }
  assignColors(){
    let i = 0;
    for(let assignation of this.schedule){
      if(!(assignation.subjectName in this.assignedColors)){
        this.assignedColors[assignation.subjectName] = colors[i];
      }
      i = (i+1)%colors.length;
    }
  }
  getSchedule() {
    this.assignationService.getAssignationByTeacherId(this.roleDetails.id).subscribe({
      next: (data: ResponseDTO<AssignationDTO[]>) => {
        this.schedule = data.content;
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        this.table = this.buildSchedule();
        this.assignColors();
      }
    });
  }
  buildSchedule() {
    let table : any[] = [];
    for(let row = 0; row < 7; row++) {
      let col : ScheduleAssignationDTO[] = [];
      col = new Array(5).fill(
        {id: 0,
          subjectName: '',
          classroomName: '',
          className: '',
          weekday: '',
          startHour: '',
          endHour: '',
          period: 0}
      );
      table.push(col);
    }
    for(let assignation of this.schedule) {
      for(let scheduleDat of assignation.schedule){
        let day = this.weekdays[scheduleDat.weekday];
        table[scheduleDat.period-1][day] =
          {id: assignation.id,
          subjectName: assignation.subjectName,
          classroomName: assignation.classroomName,
          className: assignation.className,
          weekday: scheduleDat.weekday,
          startHour: scheduleDat.startTime,
          endHour: scheduleDat.endTime,
          period: scheduleDat.period } as ScheduleAssignationDTO;
      }
    }
    return table;
  }
  selectClass(classr: any) {
    if(classr.id === 0)
      return;
    this.selectedClass = classr;
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
        hasContent: true
      }
    });
  }

}

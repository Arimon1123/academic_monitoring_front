import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AssignationService} from "../../service/assignation.service";
import {LocalStorageService} from "../../service/local-storage.service";
import {AssignationDTO} from "../../models/AssignationDTO";
import {ResponseDTO} from "../../models/ResponseDTO";
import {StudentDTO} from "../../models/StudentDTO";
import {ScheduleAssignationDTO} from "../../models/ScheduleAssignationDTO";
import {colors} from "../../consts/colors.json";
import {schedule} from "../../consts/schedule.json";
import {HourPipe} from "../../pipes/HourPipe";
import {ModalService} from "../../service/modal.service";
import {NgStyle} from "@angular/common";
import {subscribeOn} from "rxjs";
@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [
    HourPipe,
    NgStyle
  ],
  templateUrl: './student-schedule.component.html',
  styleUrl: './student-schedule.component.css'
})
export class StudentScheduleComponent {
  @ViewChild('modal') content: TemplateRef<any>|undefined;
  schedule : AssignationDTO[];
  studentData : StudentDTO;
  weekdays: { [key: string]: number } ;
  table : ScheduleAssignationDTO[][] = [];
  selectedClass: ScheduleAssignationDTO;
  assignedColors : {[key: string]: string } ;
  scheduleFormat: any;
  constructor(private assignationService: AssignationService,
              private locaStorage: LocalStorageService,
              private modalService: ModalService) {
    this.schedule = [];
    this.studentData = {
      "id": 13,
      "name": "Trueman",
      "ci": "179-94-9723",
      "fatherLastname": "Deyes",
      "motherLastname": "Paybody",
      "birthDate": "2009-05-07",
      "address": "73 Pankratz Center",
      "rude": "820-32-9193",
      "studentClass": "1°Primaria A"
    }
    this.weekdays = {
      'monday': 0,
      'tuesday': 1,
      'wednesday': 2,
      'thursday': 3,
      'friday': 4,
      'saturday': 5,
    }
    this.selectedClass = {} as ScheduleAssignationDTO;
    this.assignedColors = {} ;
    this.scheduleFormat = schedule[0];
  }
  ngOnInit(){
    this.getAssignation();
  }
  getAssignation(){
    this.assignationService.getAssignationByStudentIdAndYear(this.studentData.id,2024).subscribe(
      {
        next: (data: ResponseDTO<AssignationDTO[]>) => {
          this.schedule = data.content;
          console.log(data.content)
          this.table = this.buildSchedule();
          this.assignColors();
        }
      }
    )
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
            period: scheduleDat.period,
            teacherName: assignation.teacherName
          } as ScheduleAssignationDTO;

      }
    }
    return table;
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

  protected readonly subscribeOn = subscribeOn;
}

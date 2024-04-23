import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AssignationService} from "../../service/assignation.service";
import {AssignationDTO} from "../../models/AssignationDTO";
import {StudentDTO} from "../../models/StudentDTO";
import {ScheduleAssignationDTO} from "../../models/ScheduleAssignationDTO";
import {colors} from "../../consts/colors.json";
import {schedule} from "../../consts/schedule.json";
import {HourPipe} from "../../pipes/HourPipe";
import {ModalService} from "../../service/modal.service";
import {NgStyle} from "@angular/common";
import {forkJoin} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {StudentService} from "../../service/student.service";
@Component({
  selector: 'app-student-teacher-schedule',
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
              private modalService: ModalService,
              private activeRoute: ActivatedRoute,
              private studentService: StudentService) {
    this.schedule = [];
    this.studentData = {} as StudentDTO;
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
    this.activeRoute.params.subscribe(
      {
        next: (params) => {
          this.getData(params['id']);
        }
      }
    )
  }
  getData(studentId:number){
    forkJoin({
      student: this.studentService.getStudentById(studentId),
      assignation: this.assignationService.getAssignationByStudentIdAndYear(studentId,new Date().getFullYear())
    }).subscribe({
      next: (data) => {
        this.studentData = data.student.content;
        this.schedule = data.assignation.content;
        this.table = this.buildSchedule();
        this.assignColors();
      }
    })
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

}

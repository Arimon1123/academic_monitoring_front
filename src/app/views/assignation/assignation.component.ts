import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { GradeDTO } from '../../models/GradeDTO';
import { ClassListDTO } from '../../models/ClassListDTO';
import { SubjectDTO } from '../../models/SubjectDTO';
import { GradeService } from '../../service/grade.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { SubjectService } from '../../service/subject.service';
import { TeacherService } from '../../service/teacher.service';
import { TeacherDTO } from '../../models/TeacherDTO';
import { ClassroomDTO } from '../../models/ClassroomDTO';
import { ClassService } from '../../service/class.service';
import { schedule } from '../../consts/schedule.json'
import { ClassroomService } from '../../service/classroom.service';
import { ScheduleDTO } from '../../models/ScheduleDTO';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleCreateDTO } from '../../models/ScheduleCreateDTO';
import { CommonModule } from '@angular/common';
import { AssignationCreateDTO } from '../../models/AssignationCreateDTO';
import { AssignationService } from '../../service/assignation.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {ModalService} from "../../service/modal.service";

@Component({
  selector: 'app-assignation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignation.component.html',
  styleUrl: './assignation.component.css'
})
export class AssignationComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<any> | undefined;

  days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  showSchedule = false;
  currentAssignation: AssignationCreateDTO = {} as AssignationCreateDTO;

  gradeList: GradeDTO[] = [];
  classList: ClassListDTO[] = [];
  subjectList: SubjectDTO[] = [];
  teacherList: TeacherDTO[] = [];
  classroomList: ClassroomDTO[] = [];
  schedule: { [key: string]: ScheduleCreateDTO[] } = {};
  showedSchedule: any[] = [];
  selectedSchedules: ScheduleDTO[] = [];

  selectedGrade: GradeDTO = {} as GradeDTO;
  selectedSubject: SubjectDTO = {} as SubjectDTO;
  selectedTeacher: TeacherDTO = {} as TeacherDTO;
  selectedClass: ClassListDTO = {} as ClassListDTO;
  selectedClassroom: ClassroomDTO = {} as ClassroomDTO;
  currentYear = new Date().getFullYear();
  hours: any[] = schedule[0].hours;
  teacherSchedule: ScheduleDTO[] = [];
  classSchedule: ScheduleDTO[] = [];
  classroomSchedule: ScheduleDTO[] = [];
  constructor(private gradeService: GradeService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private classService: ClassService,
    private classroomService: ClassroomService,
    private scheduleService: ScheduleService,
    private assignationService: AssignationService,
    private modalService: ModalService) { }
  ngOnInit(): void {
    this.getGrades();
  }
  getGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: (data: ResponseDTO<GradeDTO[]>) => {
        this.gradeList = data.content;
      },
      error: (error: any) => {
        this.openModal('Error', error.error.message);
      }
    });
  }
  getSubjectsByGrade(grade: GradeDTO) {
    this.subjectService.getSubjectsByGrade(grade.id).subscribe({
      next: (data: ResponseDTO<SubjectDTO[]>) => {
        this.subjectList = data.content;
      },
      error: (error: any) => {
        this.openModal('Error', error.error.message);
      },
      complete: () => {
      }
    });
  }

  getClassByGrade(grade: GradeDTO) {
    this.classService.getClassListByGradeIdAndYearAndShift(grade.id, this.currentYear, 1).subscribe({
      next: (data: ResponseDTO<ClassListDTO[]>) => {
        this.classList = data.content;
      },
      error: (error: any) => {
        this.openModal('Error', error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    }); // This line is missing a call to the classService
  }

  selectGrade(grade: GradeDTO) {
    this.selectedGrade = grade;
    this.getClassByGrade(grade);
  }
  selectClass(classDto: ClassListDTO) {
    this.selectedClass = classDto;
    this.getAssignationOptions();
    this.getSubjectsByGrade(this.selectedGrade);
  }
  selectTeacher(event: any) {
    console.log(event.target.value)
    const teacher = this.teacherList.find(teacher => teacher.id === parseInt(event.target.value));
    if (teacher !== undefined) {
      this.selectedTeacher = teacher;
      console.log(this.selectedTeacher);
    }
  }
  selectClassroom(classroomDTO: ClassroomDTO) {
    this.selectedClassroom = classroomDTO;
  }
  selectSubject(subjectDTO: SubjectDTO) {
    this.selectedSubject = subjectDTO;
    this.getAssignationOptions();

  }

  getAssignationOptions() {
    if (this.selectedClass.id && this.selectedSubject.id) {
      forkJoin({
        teachers: this.teacherService.getTeachersBySubject(this.selectedSubject.id),
        classrooms: this.classroomService.getClassroomsByRequirements(this.selectedSubject.requirements.map(requirement => requirement.id)),
        assignation: this.assignationService.getAssignation(this.selectedClass.id, this.selectedSubject.id)
      }).subscribe({
        next: (data: any) => {
          this.teacherList = data.teachers.content;
          this.classroomList = data.classrooms.content;
          this.currentAssignation = data.assignation.content;
          this.selectedTeacher = this.teacherList.find(teacher => teacher.id === this.currentAssignation.teacherId) || {} as TeacherDTO;
          this.selectedClassroom = this.classroomList.find(classroom => classroom.id === this.currentAssignation.classroomId) || {} as ClassroomDTO;

        },
        error: (error: any) => {
          this.openModal('Error', error.error.message);
        },
        complete: () => {
          console.log('complete');
        }
      });
    }
  }

  getSchedules() {
    this.showSchedule = false;
    forkJoin({
      schedule: this.scheduleService.getScheduleByTeacher(this.selectedTeacher.id),
      classSchedule: this.scheduleService.getScheduleByClass(this.selectedClass.id),
      classroomSchedule: this.scheduleService.getScheduleByClassroom(this.selectedClassroom.id),
      selectedSchedules: this.selectedClass.id && this.selectedSubject.id ? this.scheduleService.getScheduleBySubjectAndClassId(this.selectedClass.id, this.selectedSubject.id) : []
    }
    ).subscribe({
      next: (data: any) => {
        this.teacherSchedule = data.schedule.content;
        this.classSchedule = data.classSchedule.content;
        this.classroomSchedule = data.classroomSchedule.content;
        this.selectedSchedules = data.selectedSchedules.content;
        console.log(data);
        this.composeSchedule();

      },
      error: (error: any) => {
       this.openModal('Error', error.error.message)
      },
      complete: () => {
        console.log('complete');
      }
    })
  }
  composeSchedule() {
    this.schedule = {
      'monday': structuredClone(this.hours),
      'tuesday': structuredClone(this.hours),
      'wednesday': structuredClone(this.hours),
      'thursday': structuredClone(this.hours),
      'friday': structuredClone(this.hours),
    }
    for (let schedule of this.teacherSchedule) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'teacher'
    }
    for (let schedule of this.classSchedule) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'class'
    }
    for (let schedule of this.classroomSchedule) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'classroom'
    }
    for (let schedule of this.selectedSchedules) {
      this.schedule[schedule.weekday][schedule.period - 1].isAvailable = false;
      this.schedule[schedule.weekday][schedule.period - 1].reason = 'selected'
    }
    console.log(this.schedule);
    this.showedSchedule = this.transformSchedule();
    this.showSchedule = true
  }
  transformSchedule() {
    let schedule: any[] = [];
    for (let i = 0; i < 7; i++) {
      let day1 = []
      for (let day of this.days) {
        day1.push(this.schedule[day][i]);
      }
      schedule.push(day1);
    }
    return schedule;
  }

  selectSchedule(schedule: ScheduleCreateDTO, dayIndex: number) {
    if (!schedule.isAvailable && schedule.reason !== 'selected') {
      alert('Horario No disponible');
      return;
    }
    const newSchedule = { id: null, startTime: schedule.start, endTime: schedule.end, weekday: this.days[dayIndex], period: schedule.period }
    if (!schedule.isAvailable) {
      schedule.reason = 'none';
      this.selectedSchedules = this.selectedSchedules.filter(s => (s.period !== newSchedule.period || s.weekday !== newSchedule.weekday));
    }
    else {
      if (this.selectedSubject.hours <= this.selectedSchedules.length) {
        alert('No puede seleccionar más horas de las permitidas');
        return;
      }
      schedule.reason = 'selected';
      this.selectedSchedules.push(newSchedule);

    }
    schedule.isAvailable = !schedule.isAvailable;
  }

  onSubmit() {
    const assignationDTO: AssignationCreateDTO = {
      teacherId: this.selectedTeacher.id,
      classId: this.selectedClass.id,
      subjectId: this.selectedSubject.id || 0, // Use a default value of 0 if selectedSubject.id is null
      classroomId: this.selectedClassroom.id,
      schedule: this.selectedSchedules
    }
    this.assignationService.saveAssignation(assignationDTO).subscribe({
      next: (data: ResponseDTO<any>) => {
        this.openModal('Asignación creada', data.message);
      },
      error: (error: any) => {
        this.openModal('Error', error.error.message);
      }
    });
  }

  getSubjectClasses(subjectId: number | null) {
    return {
      'bg-active': subjectId === this.selectedSubject.id,
      'text-white': subjectId === this.selectedSubject.id,
      'bg-slate-200': subjectId !== this.selectedSubject.id
    }
  }
  getGradeClasses(gradeId: number | null) {
    return {
      'bg-active': gradeId === this.selectedGrade.id,
      'text-white': gradeId === this.selectedGrade.id,
      'bg-slate-200': gradeId !== this.selectedGrade.id
    }
  }
  getClassClasses(classId: number | null) {
    return {
      'bg-active': classId === this.selectedClass.id,
      'text-white': classId === this.selectedClass.id,
      'bg-slate-200': classId !== this.selectedClass.id
    }
  }

  getClassroomClasses(classroomId: number | null) {
    return {
      'bg-active': classroomId === this.selectedClassroom.id,
      'text-white': classroomId === this.selectedClassroom.id,
      'bg-slate-200': classroomId !== this.selectedClassroom.id
    }
  }
  getCellClasses(period: ScheduleCreateDTO) {
    return {
      'bg-red-500': period.isAvailable === false && period.reason !== 'selected',
      'bg-green-500': period.isAvailable,
      'bg-blue-500': period.isAvailable === false && period.reason === 'selected'
    }
  }

  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        isSubmittable: false,
        title: title,
        message: message
      }
    });
  }

}

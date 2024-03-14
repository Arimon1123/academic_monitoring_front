import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-assignation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignation.component.html',
  styleUrl: './assignation.component.css'
})
export class AssignationComponent implements OnInit {
  days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  showSchedule = false;

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
    private assignationService: AssignationService) { }
  ngOnInit(): void {
    this.getGrades();
  }
  getGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: (data: ResponseDTO<GradeDTO[]>) => {
        this.gradeList = data.content;
      },
      error: (error: any) => {
        alert('Error al cargar los grados ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  getSubjectsByGrade(grade: GradeDTO) {
    this.subjectService.getSubjectsByGrade(grade.id).subscribe({
      next: (data: ResponseDTO<SubjectDTO[]>) => {
        this.subjectList = data.content;
        console.log(this.subjectList);
      },
      error: (error: any) => {
        alert('Error al cargar las materias ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  getTeachersBySubject(subject: SubjectDTO) {
    const subjectId = subject.id ?? 0; // Use 0 as a fallback value if subject.id is null
    this.teacherService.getTeachersBySubject(subjectId).subscribe({
      next: (data: ResponseDTO<TeacherDTO[]>) => {
        this.teacherList = data.content;
      },
      error: (error: any) => {
        alert('Error al cargar los docentes ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  getClassByGrade(grade: GradeDTO) {
    this.classService.getClassListByGradeIdAndYearAndShift(grade.id, this.currentYear, 1).subscribe({
      next: (data: ResponseDTO<ClassListDTO[]>) => {
        this.classList = data.content;
      },
      error: (error: any) => {
        alert('Error al cargar las clases ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    }); // This line is missing a call to the classService
  }
  getClassroomByRequirements() {
    const requirementIds = this.selectedSubject.requirements.map(requirement => requirement.id);
    this.classroomService.getClassroomsByRequirements(requirementIds).subscribe({
      next: (data: ResponseDTO<ClassroomDTO[]>) => {
        this.classroomList = data.content;
      },
      error: (error: any) => {
        alert('Error al cargar las aulas ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  getTeacherSchedule() {
    this.scheduleService.getScheduleByTeacher(this.selectedTeacher.id).subscribe({
      next: (data: ResponseDTO<ScheduleDTO[]>) => {
        this.teacherSchedule = data.content;
        console.log(this.teacherSchedule);
      },
      error: (error: any) => {
        alert('Error al cargar el horario del docente ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  getClassSchedule() {
    this.scheduleService.getScheduleByClass(this.selectedClass.id).subscribe({
      next: (data: ResponseDTO<ScheduleDTO[]>) => {
        this.classSchedule = data.content;
        console.log(this.classSchedule);
      },
      error: (error: any) => {
        alert('Error al cargar el horario de la clase ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  getClassroomSchedule() {
    this.scheduleService.getScheduleByClassroom(this.selectedClassroom.id).subscribe({
      next: (data: ResponseDTO<ScheduleDTO[]>) => {
        this.classroomSchedule = data.content;
        console.log(this.classroomSchedule);
      },
      error: (error: any) => {
        alert('Error al cargar el horario del aula ' + error.error.message);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  selectGrade(grade: GradeDTO) {
    this.selectedGrade = grade;
    this.getClassByGrade(grade);
  }
  selectClass(classDto: ClassListDTO) {
    this.selectedClass = classDto;
    this.getSubjectsByGrade(this.selectedGrade);
  }
  selectTeacher(event: any) {
    console.log(event.target.value)
    const teacher = this.teacherList.find(teacher => teacher.id === parseInt(event.target.value));
    if (teacher !== undefined) {
      this.selectedTeacher = teacher;
      console.log(this.selectedTeacher);
    }
    if (this.selectedClassroom.id !== undefined) {
      this.showSchedule = true;
    }
  }
  selectClassroom(classroomDTO: ClassroomDTO) {
    this.selectedClassroom = classroomDTO;
    if (this.selectedTeacher.id !== undefined) {
      this.showSchedule = true;
    }
  }
  selectSubject(subjectDTO: SubjectDTO) {
    this.selectedSubject = subjectDTO;
    this.getTeachersBySubject(subjectDTO);
    this.getClassroomByRequirements();
  }
  getSubjectAndClassSchedule() {
    if (this.selectedClass.id !== null && this.selectedSubject.id !== null) {
      this.scheduleService.getScheduleBySubjectAndClassId(this.selectedClass.id, this.selectedSubject.id).subscribe({
        next: (data: ResponseDTO<ScheduleDTO[]>) => {
          this.selectedSchedules = data.content;
          console.log(this.schedule);
        },
        error: (error: any) => {
          alert('Error al cargar el horario de la clase ' + error.error.message);
        },
        complete: () => {
          console.log('complete');
        }
      });
    }
  }

  getSchedules() {
    this.getTeacherSchedule();
    this.getClassSchedule();
    this.getClassroomSchedule();
    this.getSubjectAndClassSchedule();
    setTimeout(() => {
      this.composeSchedule();
    }, 1500)

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
        alert(data.message);
      },
      error: (error: any) => {
        alert('Error al crear la asignación ' + error.error.message);
      }
    });
  }

}
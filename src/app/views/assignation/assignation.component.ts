import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { schedule } from '../../consts/schedule.json';
import { ClassroomService } from '../../service/classroom.service';
import { ScheduleDTO } from '../../models/ScheduleDTO';
import { ScheduleCreateDTO } from '../../models/ScheduleCreateDTO';
import { CommonModule } from '@angular/common';
import { AssignationCreateDTO } from '../../models/AssignationCreateDTO';
import { AssignationService } from '../../service/assignation.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../service/modal.service';
import { PeriodDTO } from '../../models/PeriodDTO';
import { ScheduleSelectionComponent } from '../../components/schedule-selection/schedule-selection.component';

@Component({
  selector: 'app-assignation',
  standalone: true,
  imports: [CommonModule, FormsModule, ScheduleSelectionComponent],
  templateUrl: './assignation.component.html',
  styleUrl: './assignation.component.css',
})
export class AssignationComponent implements OnInit {
  @ViewChild('modal') contentEl: TemplateRef<unknown> | undefined;
  @ViewChild('course') courseEl: ElementRef | undefined;
  @ViewChild('subject') subjectEl: ElementRef | undefined;
  @ViewChild('schedule') scheduleEl: ElementRef | undefined;
  showSchedule = false;
  currentAssignation: AssignationCreateDTO = {} as AssignationCreateDTO;

  gradeList: GradeDTO[] = [];
  classList: ClassListDTO[] = [];
  subjectList: SubjectDTO[] = [];
  teacherList: TeacherDTO[] = [];
  classroomList: ClassroomDTO[] = [];
  schedule: { [key: string]: ScheduleCreateDTO[] } = {};
  selectedSchedules: ScheduleDTO[] = [];

  selectedGrade: GradeDTO = {} as GradeDTO;
  selectedSubject: SubjectDTO = {} as SubjectDTO;
  selectedTeacher: TeacherDTO = {} as TeacherDTO;
  selectedClass: ClassListDTO = {} as ClassListDTO;
  selectedClassroom: ClassroomDTO = {} as ClassroomDTO;
  currentYear = new Date().getFullYear();
  hours: PeriodDTO[] = schedule[0].hours;
  teacherSchedule: ScheduleDTO[] = [];
  constructor(
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private classService: ClassService,
    private classroomService: ClassroomService,
    private assignationService: AssignationService,
    private modalService: ModalService
  ) {}
  ngOnInit(): void {
    this.getGrades();
  }
  getGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: (data: ResponseDTO<GradeDTO[]>) => {
        this.gradeList = data.content;
      },
      error: (error: Error) => {
        this.openModal('Error', error.message);
      },
    });
  }
  getSubjectsByGrade(grade: GradeDTO) {
    this.subjectService.getSubjectsByGrade(grade.id).subscribe({
      next: (data: ResponseDTO<SubjectDTO[]>) => {
        this.subjectList = data.content;
      },
      error: (error: Error) => {
        this.openModal('Error', error.message);
      },
      complete: () => {},
    });
  }

  getClassByGrade(grade: GradeDTO) {
    this.classService
      .getClassListByGradeIdAndYearAndShift(grade.id, this.currentYear, 1)
      .subscribe({
        next: (data: ResponseDTO<ClassListDTO[]>) => {
          this.classList = data.content;
        },
        error: (error: Error) => {
          this.openModal('Error', error.message);
        },
      });
  }

  selectGrade(grade: GradeDTO) {
    this.showSchedule = false;
    this.selectedGrade = grade;
    this.getClassByGrade(grade);
    setTimeout(() => {
      this.courseEl?.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }, 250);
  }
  selectClass(classDto: ClassListDTO) {
    this.showSchedule = false;
    this.selectedClass = classDto;
    this.getAssignationOptions();
    this.getSubjectsByGrade(this.selectedGrade);
    setTimeout(() => {
      this.subjectEl?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  }
  selectTeacher(event: Event) {
    this.showSchedule = false;
    const teacher = this.teacherList.find(
      teacher =>
        teacher.id === parseInt((event.target as HTMLInputElement).value)
    );
    if (teacher !== undefined) {
      this.selectedTeacher = teacher;
    }
  }
  selectClassroom(classroomDTO: ClassroomDTO) {
    this.showSchedule = false;
    this.selectedClassroom = classroomDTO;
  }
  selectSubject(subjectDTO: SubjectDTO) {
    this.showSchedule = false;
    this.selectedSubject = subjectDTO;
    this.getAssignationOptions();
    setTimeout(() => {
      this.scheduleEl?.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }, 250);
  }

  getAssignationOptions() {
    if (this.selectedClass.id && this.selectedSubject.id) {
      forkJoin({
        teachers: this.teacherService.getTeachersBySubject(
          this.selectedSubject.id
        ),
        classrooms: this.classroomService.getClassroomsByRequirements(
          this.selectedSubject.requirements.map(requirement => requirement.id)
        ),
        assignation: this.assignationService.getAssignation(
          this.selectedClass.id,
          this.selectedSubject.id
        ),
      }).subscribe({
        next: (data: {
          teachers: ResponseDTO<TeacherDTO[]>;
          classrooms: ResponseDTO<ClassroomDTO[]>;
          assignation: ResponseDTO<AssignationCreateDTO>;
        }) => {
          this.teacherList = data.teachers.content;
          this.classroomList = data.classrooms.content;
          this.currentAssignation = data.assignation.content;
          if (this.currentAssignation) {
            this.selectedTeacher =
              this.teacherList.find(
                teacher => teacher.id === this.currentAssignation.teacherId
              ) || ({} as TeacherDTO);
            this.selectedClassroom =
              this.classroomList.find(
                classroom =>
                  classroom.id === this.currentAssignation.classroomId
              ) || ({} as ClassroomDTO);
          } else {
            this.selectedTeacher = { id: 0 } as TeacherDTO;
            this.selectedClassroom = {} as ClassroomDTO;
          }
        },
        error: (error: Error) => {
          this.openModal('Error', error.message);
        },
      });
    }
  }
  onSubmitHandler() {
    const assignationDTO: AssignationCreateDTO = {
      teacherId: this.selectedTeacher.id,
      classId: this.selectedClass.id,
      subjectId: this.selectedSubject.id || 0, // Use a default value of 0 if selectedSubject.id is null
      classroomId: this.selectedClassroom.id,
      schedule: this.selectedSchedules,
    };
    this.assignationService.saveAssignation(assignationDTO).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Asignación creada', data.message);
      },
      error: (error: Error) => {
        this.openModal('Error', error.message);
      },
    });
  }

  getSubjectClasses(subjectId: number | null) {
    return {
      'bg-active': subjectId === this.selectedSubject.id,
      'text-white': subjectId === this.selectedSubject.id,
      'bg-slate-200': subjectId !== this.selectedSubject.id,
    };
  }
  getGradeClasses(gradeId: number | null) {
    return {
      'bg-active': gradeId === this.selectedGrade.id,
      'text-white': gradeId === this.selectedGrade.id,
      'bg-slate-200': gradeId !== this.selectedGrade.id,
    };
  }
  getClassClasses(classId: number | null) {
    return {
      'bg-active': classId === this.selectedClass.id,
      'text-white': classId === this.selectedClass.id,
      'bg-slate-200': classId !== this.selectedClass.id,
    };
  }

  getClassroomClasses(classroomId: number | null) {
    return {
      'bg-active': classroomId === this.selectedClassroom.id,
      'text-white': classroomId === this.selectedClassroom.id,
      'bg-slate-200': classroomId !== this.selectedClassroom.id,
    };
  }

  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.contentEl!,
      options: {
        isSubmittable: false,
        title: title,
        message: message,
      },
    });
  }
  onUpdateScheduleHandler(schedule: ScheduleDTO[]) {
    this.selectedSchedules = schedule;
    console.log(this.selectedSchedules);
  }
  onClickShowScheduleHandler() {
    this.showSchedule = true;
  }
  showCurrentClassroom(event: Event) {
    console.log(event);
    (event.target as HTMLInputElement).scrollIntoView({ behavior: 'smooth' });
  }
}

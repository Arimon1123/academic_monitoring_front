import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AssignationDTO } from '../../models/AssignationDTO';
import { StudentDTO } from '../../models/StudentDTO';
import { StudentService } from '../../service/student.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ActivityDTO } from '../../models/ActivityDTO';
import { ActivityService } from '../../service/activity.service';
import { GradesService } from '../../service/grades.service';
import { ActivityGradeDTO } from '../../models/ActivityGradeDTO';
import { forkJoin } from 'rxjs';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { RoundPipe } from '../../pipes/RoundPipe';
import { ModalService } from '../../service/modal.service';
import { ActivatedRoute } from '@angular/router';
import { AssignationService } from '../../service/assignation.service';
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';
@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [DecimalPipe, RoundPipe, NgClass, NgStyle],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css',
})
export class GradesComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  assignation: AssignationDTO;
  students: StudentDTO[];
  activities: ActivityDTO[];
  grades: { [key: number]: ActivityGradeDTO[] };
  table: { student: StudentDTO; grades: ActivityGradeDTO[] }[];
  bimester = 0;
  decidirActivities: ActivityDTO[] = [];
  serActivities: ActivityDTO[] = [];
  saberActivities: ActivityDTO[] = [];
  hacerActivities: ActivityDTO[] = [];
  configuration: ConfigurationDTO = {} as ConfigurationDTO;
  dimensionValue: { [key: string]: number } = {
    HACER: 30,
    SABER: 30,
    SER: 20,
    DECIDIR: 20,
  };
  constructor(
    private studentService: StudentService,
    private activityService: ActivityService,
    private gradesService: GradesService,
    private modalService: ModalService,
    private activeRoute: ActivatedRoute,
    private assignationService: AssignationService,
    private configDataService: ConfigurationDataService
  ) {
    this.assignation = {} as AssignationDTO;
    this.students = [];
    this.activities = [];
    this.grades = [];
    this.table = [];
  }
  ngOnInit() {
    this.getConfiguration();
  }
  getConfiguration() {
    this.configDataService.currentConfig.subscribe({
      next: (data: ConfigurationDTO | null) => {
        this.configuration = data!;
        this.bimester = this.configuration.currentBimester;
        this.activeRoute.params.subscribe({
          next: params => {
            this.getAllData(params['id']);
          },
        });
      },
    });
  }
  getAllData(assignationId: number) {
    console.log('getting data' + assignationId);
    forkJoin({
      activities: this.activityService.getActivitiesByAssignationId(
        assignationId,
        this.bimester
      ),
      students: this.studentService.getStudentsByAssignationId(assignationId),
      grades: this.gradesService.getGradesByAssignation(
        assignationId,
        this.bimester
      ),
      assignation: this.assignationService.getAssignationById(assignationId),
    }).subscribe({
      next: (data: {
        activities: ResponseDTO<ActivityDTO[]>;
        students: ResponseDTO<StudentDTO[]>;
        grades: ResponseDTO<{ [key: number]: ActivityGradeDTO[] }>;
        assignation: ResponseDTO<AssignationDTO>;
      }) => {
        this.activities = data.activities.content;
        this.students = data.students.content;
        this.grades = data.grades.content;
        this.assignation = data.assignation.content;
        this.serActivities = this.activities.filter(value => {
          return value.dimension === 'SER';
        });
        this.hacerActivities = this.activities.filter(value => {
          return value.dimension === 'HACER';
        });
        this.saberActivities = this.activities.filter(value => {
          return value.dimension === 'SABER';
        });
        this.decidirActivities = this.activities.filter(value => {
          return value.dimension === 'DECIDIR';
        });
        this.buildTable();
      },
    });
  }
  buildTable() {
    this.table = [];
    for (const student of this.students) {
      const grades: { student: StudentDTO; grades: ActivityGradeDTO[] } = {
        student: student,
        grades: [],
      };
      let finalGrade = 0;
      this.activities = this.activities.sort((a, b) => {
        return ('' + a.dimension).localeCompare(b.dimension);
      });
      for (const activity of this.activities) {
        const grade = this.grades[student.id]
          ? this.grades[student.id].find(
              grade => grade.activityId === activity.id
            )
          : undefined;
        if (grade) {
          grades.grades.push(grade);
          finalGrade +=
            activity.value *
            (grade!.grade / 100) *
            (this.dimensionValue[activity.dimension] / 100);
        } else {
          const newGrade = {
            id: { studentId: student.id, activityId: activity.id },
            studentId: student.id,
            activityId: activity.id,
            grade: 0,
          };
          grades.grades.push(newGrade);
          finalGrade +=
            activity.value *
            (newGrade!.grade / 100) *
            (this.dimensionValue[activity.dimension] / 100);
        }
      }
      grades.grades.push({
        id: { studentId: 0, activityId: 0 },
        studentId: 0,
        grade: finalGrade,
        activityId: 0,
      });
      this.table.push(grades);
    }
  }
  saveGrades() {
    const grades: ActivityGradeDTO[] = [];
    for (const student of this.table) {
      for (const grade of student.grades) {
        if (!(grade.activityId === 0)) {
          grades.push(grade);
        }
      }
    }
    this.gradesService.saveGradesBy(grades).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal(data.message, 'Calificaciones Guardadas');
      },
    });
  }
  updateGrade(event: Event, activity: ActivityGradeDTO, index: number) {
    const target = event.target as HTMLInputElement;
    const grade = parseInt(target.value);
    if (grade > 100 || grade < 0) {
      this.openModal(
        'La calificación debe ser un número entre 0 y 100',
        'Error'
      );
      target.value = String(0);
      return;
    }
    activity.grade = parseInt(target.value);
    const tableRow = this.table[index];
    let finalGrade = 0;
    for (const grade of tableRow.grades) {
      if (grade.activityId !== 0) {
        const activity = this.activities.find(
          activity => activity.id === grade.activityId
        );
        finalGrade +=
          ((activity!.value / 100) *
            grade.grade *
            this.dimensionValue[activity!.dimension]) /
          100;
        console.log(finalGrade);
      }
    }
    tableRow.grades[this.activities.length].grade = finalGrade;
  }
  openModal(message: string, title: string) {
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

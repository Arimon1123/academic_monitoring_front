import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { ActivityService } from '../../service/activity.service';
import { GradesService } from '../../service/grades.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ActivityDTO } from '../../models/ActivityDTO';
import { ActivityGradeDTO } from '../../models/ActivityGradeDTO';
import { StudentDTO } from '../../models/StudentDTO';
import { forkJoin } from 'rxjs';
import { AssignationService } from '../../service/assignation.service';
import { AssignationDTO } from '../../models/AssignationDTO';
import { NgClass, NgStyle } from '@angular/common';
import { RoundPipe } from '../../pipes/RoundPipe';
import { StudentService } from '../../service/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { UserDTO } from '../../models/UserDTO';

@Component({
  selector: 'app-student-activities',
  standalone: true,
  imports: [NgStyle, RoundPipe, NgClass, RouterLink],
  templateUrl: './student-activities.component.html',
  styleUrl: './student-activities.component.css',
})
export class StudentActivitiesComponent implements OnInit {
  bimester: number = 0;
  assignationId: number = 0;
  activities: ActivityDTO[];
  grades: ActivityGradeDTO[];
  studentData: StudentDTO;
  table: {
    id: number | { activityId: number; studentId: number };
    activity: string;
    value: number;
    grade: number;
    dimension: string;
    total: number;
  }[] = [];
  dimensionValue: { [key: string]: number };
  totalGrade: number;
  assignation: AssignationDTO;
  user: UserDTO = {} as UserDTO;
  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private gradesService: GradesService,
    private assignationService: AssignationService,
    private studentService: StudentService,
    private userService: UserService
  ) {
    this.assignation = {} as AssignationDTO;
    this.activities = [];
    this.grades = [];
    this.table = [];
    this.totalGrade = 0;
    this.studentData = {} as StudentDTO;
    this.dimensionValue = {
      HACER: 30,
      SABER: 30,
      SER: 20,
      DECIDIR: 20,
    };
  }
  ngOnInit(): void {
    this.getRouteParams();
  }
  getRouteParams() {
    this.route.params.subscribe({
      next: (params: Params) => {
        this.getData(
          params['studentId'],
          params['assignationId'],
          params['bimester']
        );
        this.bimester = params['bimester'];
      },
    });
  }
  getData(studentId: number, assignationId: number, bimester: number) {
    forkJoin({
      activities: this.activityService.getActivitiesByAssignationId(
        assignationId,
        bimester
      ),
      grades: this.gradesService.getGradesByStudentIdAndAssignationAndBimester(
        studentId,
        assignationId,
        bimester
      ),
      assignation: this.assignationService.getAssignationById(assignationId),
      student: this.studentService.getStudentById(studentId),
      user: this.userService.getUserByAssignationId(assignationId),
    }).subscribe({
      next: (data: {
        activities: ResponseDTO<ActivityDTO[]>;
        grades: ResponseDTO<ActivityGradeDTO[]>;
        assignation: ResponseDTO<AssignationDTO>;
        student: ResponseDTO<StudentDTO>;
        user: ResponseDTO<UserDTO>;
      }) => {
        this.activities = data.activities.content;
        this.grades = data.grades.content;
        this.assignation = data.assignation.content;
        this.studentData = data.student.content;
        this.table = this.buildTable();
        console.log(this.table);
        this.user = data.user.content;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.message);
      },
    });
  }
  buildTable() {
    const table = [];
    for (let i = 0; i < this.activities.length; i++) {
      const activity = this.activities[i];
      const grade = this.grades.find(grade => grade.activityId === activity.id);
      this.totalGrade +=
        (((activity.value * (grade?.grade || 0)) / 100) *
          this.dimensionValue[activity.dimension]) /
        100;
      table.push({
        id: grade?.id || 0,
        activity: activity.name,
        value: activity.value,
        grade: grade?.grade || 0,
        dimension: activity.dimension,
        total:
          (((activity.value * (grade?.grade || 0)) / 100) *
            this.dimensionValue[activity.dimension]) /
          100,
      });
    }
    return table;
  }
}

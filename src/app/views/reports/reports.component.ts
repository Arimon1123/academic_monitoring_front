import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../service/reports.service';
import {
  BarChartModule,
  LineChartModule,
  PieChartModule,
} from '@swimlane/ngx-charts';
import { AttendanceReportDTO } from '../../models/AttendanceReportDTO';
import { GradeRangeReportDTO } from '../../models/GradeRangeReportDTO';
import { DatePipe } from '@angular/common';
import { PerformanceReportDTO } from '../../models/PerformanceReportDTO';
import { FormsModule } from '@angular/forms';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BarChartModule,
    LineChartModule,
    PieChartModule,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  colorScheme = {
    domain: [
      '#FF5733',
      '#FF69B4',
      '#FF6347',
      '#7FFF00',
      '#40E0D0',
      '#8A2BE2',
      '#00FF7F',
      '#FFD700',
    ],
  };
  attendanceRawData: AttendanceReportDTO[] = [];
  attendanceData: any[] = [];
  attendanceCustomColors: any[] = [];
  showAttendance = false;
  attendanceGradeId = 1;

  gradeRangeRawData: GradeRangeReportDTO[] = [];
  gradeRangeData: any[] = [];
  gradeRangeCustomColors: any[] = [];
  showGradeRange = false;
  bimester = 1;
  gradeRangeGradeId = 1;

  performanceRawData: PerformanceReportDTO[] = [];
  performanceData: any[] = [];
  showGradePerformance = false;
  perfoYMax = 0;
  perfoYMin = 100;
  startDateString: string = '2024-02-01';
  startDate: Date = new Date(this.startDateString);
  endDateString: string = '2024-05-09';
  endDate: Date = new Date(this.endDateString);
  performanceGradeId = 1;

  configData: ConfigurationDTO | undefined;
  attendanceType: { [key: number]: string } = {
    1: 'Presente',
    2: 'Ausente',
    3: 'Licencia',
  };
  ngOnInit() {
    this.confDataService.currentConfig.subscribe({
      next: value => {
        this.configData = value!;
        this.startDateString = `${this.configData.currentYear}-02-01`;
        this.startDate = new Date(this.startDateString);
        this.endDateString = `${this.configData.currentYear}-05-09`;
        this.endDate = new Date(this.endDateString);
        this.getAttendanceReport(
          this.startDate,
          this.endDate,
          this.attendanceGradeId
        );
        this.getGradeRangeReport(this.bimester, this.gradeRangeGradeId);
        this.getPerformanceReport(this.performanceGradeId);
      },
    });
  }
  constructor(
    private reportService: ReportsService,
    private confDataService: ConfigurationDataService
  ) {}
  getAttendanceReport(startDate: Date, endDate: Date, gradeId: number) {
    const [startDateString] = startDate.toISOString().split('T');
    const [endDateString] = endDate.toISOString().split('T');
    return this.reportService
      .getAttendanceReport(startDateString, endDateString, gradeId)
      .subscribe({
        next: (response: ResponseDTO<AttendanceReportDTO[]>) => {
          this.attendanceRawData = response.content;
          this.buildAttendanceData(this.attendanceRawData);
        },
      });
  }
  buildAttendanceData(attendanceRawData: AttendanceReportDTO[]) {
    const dataMap = new Map();
    attendanceRawData.forEach(attendance => {
      const key = `${attendance.gradeNumber}° ${attendance.identifier}`;
      const type = this.attendanceType[attendance.attendanceType];
      if (!dataMap.has(key)) {
        dataMap.set(key, [
          {
            name: type,
            value: attendance.attendance,
            extra: {
              code: attendance.identifier,
            },
          },
        ]);
      } else {
        dataMap.get(key).push({
          name: type,
          value: attendance.attendance,
          extra: {
            code: attendance.identifier,
          },
        });
      }
    });
    const data: any[] = [];
    dataMap.forEach((value: any, key: string) => {
      const row = { name: key, series: value };
      data.push(row);
    });
    this.attendanceData = data;
    this.showAttendance = true;
  }

  getGradeRangeReport(bimester: number, gradeId: number) {
    this.reportService
      .getGradeRangeReport(bimester, gradeId, this.configData!.currentYear)
      .subscribe({
        next: response => {
          this.gradeRangeRawData = response.content;
          console.log();
          this.buildGradeRangeData(this.gradeRangeRawData);
        },
      });
  }

  buildGradeRangeData(gradeRangeRawData: GradeRangeReportDTO[]) {
    this.gradeRangeData = [];
    gradeRangeRawData.forEach((gradeRange, index) => {
      this.gradeRangeData.push({
        name: gradeRange.range,
        value: gradeRange.count,
        extra: {
          total: gradeRange.range,
        },
      });
      this.gradeRangeCustomColors.push({
        name: gradeRange.range,
        value: this.colorScheme.domain[index],
      });
    });
    this.showGradeRange = true;
    console.log(this.gradeRangeData);
  }
  getPerformanceReport(gradeId: number) {
    this.reportService
      .getPerformanceReport(gradeId, this.configData!.currentYear)
      .subscribe({
        next: response => {
          this.performanceRawData = response.content;
          this.buildPerformanceData(this.performanceRawData);
        },
      });
  }
  buildPerformanceData(performanceRawData: PerformanceReportDTO[]) {
    const dataMap = new Map();
    performanceRawData.forEach(performance => {
      const key = `${performance.gradeNumber}° ${performance.identifier}`;
      if (performance.grade > this.perfoYMax) {
        this.perfoYMax = performance.grade + 5;
      }
      if (performance.grade < this.perfoYMin) {
        this.perfoYMin = performance.grade - 5;
      }
      if (!dataMap.has(key)) {
        dataMap.set(key, [
          {
            name: `${performance.bimester}`,
            value: performance.grade,
            extra: {
              code: performance.identifier,
            },
          },
        ]);
      } else {
        dataMap.get(key).push({
          name: ` ${performance.bimester}`,
          value: performance.grade,
          extra: {
            code: performance.identifier,
          },
        });
      }
    });
    const data: any[] = [];
    dataMap.forEach((value: any, key: string) => {
      const row = { name: key, series: value };
      data.push(row);
    });
    this.performanceData = data;
    this.showGradePerformance = true;
  }

  onBimesterChange(event: Event) {
    this.bimester = parseInt((event.target as HTMLInputElement).value);
    this.getGradeRangeReport(this.bimester, this.gradeRangeGradeId);
  }
  onEndDateChange() {
    this.endDate = new Date(this.endDateString);
    this.getAttendanceReport(
      this.startDate,
      this.endDate,
      this.attendanceGradeId
    );
  }
  onStartDateChange() {
    this.startDate = new Date(this.startDateString);
    this.getAttendanceReport(
      this.startDate,
      this.endDate,
      this.attendanceGradeId
    );
  }

  onAttendanceGradeChange() {
    this.getAttendanceReport(
      this.startDate,
      this.endDate,
      this.attendanceGradeId
    );
  }
  onPerformanceGradeChange() {
    this.getPerformanceReport(this.performanceGradeId);
  }
  onRangeGradeChange() {
    this.getGradeRangeReport(this.bimester, this.gradeRangeGradeId);
  }
}

import {Component} from '@angular/core';
import {ReportsService} from "../../service/reports.service";
import {BarChartModule, LegendPosition, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {AttendanceReportDTO} from "../../models/AttendanceReportDTO";
import {GradeRangeReportDTO} from "../../models/GradeRangeReportDTO";
import {DatePipe} from "@angular/common";
import {PerformanceReportDTO} from "../../models/PerformanceReportDTO";
import {FormsModule} from "@angular/forms";
import {ResponseDTO} from "../../models/ResponseDTO";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BarChartModule,
    LineChartModule,
    PieChartModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  colorScheme = {
    domain : ["#FF5733",
      "#FF69B4",
      "#FF6347",
      "#7FFF00",
      "#40E0D0",
      "#8A2BE2",
      "#00FF7F",
      "#FFD700",]
  }
  attendanceRawData: AttendanceReportDTO[] = []
  attendanceData: any[] = [];
  attendanceCustomColors: any[] = [];
  showAttendance = false;
  attendanceGradeId = 1;

  gradeRangeRawData: GradeRangeReportDTO[] = [];
  gradeRangeData: any[]=[];
  gradeRangeCustomColors: any[] = [];
  showGradeRange = false;
  bimester = 1;
  gradeRangeGradeId = 1;

  performanceRawData: PerformanceReportDTO[] = [];
  performanceData: any[]=[];
  showGradePerformance = false;
  perfoYMax = 0;
  perfoYMin = 100;
  startDateString: string = '2024-02-01'
  startDate: Date = new Date(this.startDateString);
  endDateString: string = '2024-05-09';
  endDate: Date = new Date(this.endDateString);
  performanceGradeId = 1;

  attendanceType: {[key : number]: string} = {
    1: "Presente",
    2: "Ausente",
    3: "Licencia"
  }
  ngOnInit() {
    this.getAttendanceReport(this.startDate,this.endDate,this.attendanceGradeId);
    this.getGradeRangeReport(this.bimester,this.gradeRangeGradeId);
    this.getPerformanceReport(this.performanceGradeId);
  }
  constructor(private reportService: ReportsService) { }
  getAttendanceReport(startDate: Date, endDate: Date, gradeId: number){
    const [startDateString] = startDate.toISOString().split('T');
    const [endDateString] = endDate.toISOString().split('T');
    return this.reportService.getAttendanceReport(startDateString,endDateString,gradeId).subscribe({
      next: (response: ResponseDTO<AttendanceReportDTO[]>) =>{
        this.attendanceRawData = response.content;
        this.buildAttendanceData(this.attendanceRawData);
      }
    })
  }
  buildAttendanceData(attendanceRawData: AttendanceReportDTO[]){
    let dataMap = new Map();
    attendanceRawData.forEach(attendance => {
      const key = `${attendance.gradeNumber}° ${attendance.identifier}`;
      const type = this.attendanceType[attendance.attendanceType];
      if(!dataMap.has(key)){
        dataMap.set(key,[{
          name: type,
          value: attendance.attendance,
          extra: {
            code: attendance.identifier
          }
        }]);
      }
      else{
        dataMap.get(key).push({
          name: type,
          value: attendance.attendance,
          extra: {
            code: attendance.identifier
          }
        });
      }
    });
    let data: any[] = [];
    let index = 0;
    dataMap.forEach((value: any, key: string) => {
      let row = { name : key , series: value}
      data.push(row)
      index += 1;
    });
    this.attendanceData = data;
    this.showAttendance = true;

  }

  getGradeRangeReport(bimester: number, gradeId:number){
    this.reportService.getGradeRangeReport(bimester,gradeId).subscribe({
      next: (response) => {
        this.gradeRangeRawData = response.content;
        console.log()
        this.buildGradeRangeData(this.gradeRangeRawData);
      }
    })
  }

  buildGradeRangeData(gradeRangeRawData: GradeRangeReportDTO[]){
    this.gradeRangeData = [];
      gradeRangeRawData.forEach(((gradeRange,index) => {
      this.gradeRangeData.push({
        name: gradeRange.range,
        value: gradeRange.count,
        extra: {
          total: gradeRange.range
        }});
      this.gradeRangeCustomColors.push({ name: gradeRange.range, value: this.colorScheme.domain[index]});
    }));
      this.showGradeRange = true;
    console.log(this.gradeRangeData)
  }
  getPerformanceReport(gradeId:number){
    this.reportService.getPerformanceReport(gradeId).subscribe({
      next: (response) => {
        this.performanceRawData = response.content;
        this.buildPerformanceData(this.performanceRawData);
      }
    })
  }
  buildPerformanceData(performanceRawData: PerformanceReportDTO[]){
    let dataMap = new Map();
    performanceRawData.forEach(performance => {
      const key = `${performance.gradeNumber}° ${performance.identifier}`;
      if(performance.grade > this.perfoYMax){
        this.perfoYMax = performance.grade + 5;
      }
      if(performance.grade < this.perfoYMin){
        this.perfoYMin = performance.grade - 5;
      }
      if(!dataMap.has(key)){
        dataMap.set(key,[{
          name: `${performance.bimester}`,
          value: performance.grade,
          extra: {
            code: performance.identifier
          }
        }]);
      }
      else{
        dataMap.get(key).push({
          name: ` ${performance.bimester}`,
          value: performance.grade,
          extra: {
            code: performance.identifier
          }
        });
      }
    });
    let data: any[] = [];
    let index = 0;
    dataMap.forEach((value: any, key: string) => {
      let row = { name : key , series: value}
      data.push(row)
      index += 1;
    });
    this.performanceData = data;
    this.showGradePerformance = true;
  }

  onBimesterChange(event:any){
    this.bimester = event.target.value;
    this.getGradeRangeReport(this.bimester,this.gradeRangeGradeId);
  }
  onEndDateChange(){
    this.endDate =  new Date(this.endDateString);
    this.getAttendanceReport(this.startDate,this.endDate, this.attendanceGradeId);
  }
  onStartDateChange(){
    this.startDate = new Date(this.startDateString);
    this.getAttendanceReport(this.startDate,this.endDate, this.attendanceGradeId);
  }

  onAttendanceGradeChange(){
    this.getAttendanceReport(this.startDate,this.endDate, this.attendanceGradeId);
  }
  onPerformanceGradeChange(){
    this.getPerformanceReport(this.performanceGradeId)
  }
  onRangeGradeChange(){
    this.getGradeRangeReport(this.bimester,this.gradeRangeGradeId);
  }
}
// {
//     "name": "Mayotte",
//     "series": [
//       {
//         "value": 3155,
//         "name": "2016-09-23T15:32:05.735Z"
//       },
//       {
//         "value": 6268,
//         "name": "2016-09-17T01:50:48.033Z"
//       },
//       {
//         "value": 3026,
//         "name": "2016-09-21T12:31:15.015Z"
//       },
//       {
//         "value": 2733,
//         "name": "2016-09-20T17:25:46.863Z"
//       },
//       {
//         "value": 2823,
//         "name": "2016-09-18T15:49:24.479Z"
//       }
//     ]

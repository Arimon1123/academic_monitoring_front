import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment.development";
import {AttendanceDTO} from "../models/AttendanceDTO";
import {ResponseDTO} from "../models/ResponseDTO";
import {AttendanceDateDTO} from "../models/AttendanceDateDTO";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private API_URL = environment.API_URL;
  constructor(private http:HttpClient) { }

  getAttendanceByAssignationId(assignationId: number){
    return this.http.get<ResponseDTO<AttendanceDTO[]>>(`${this.API_URL}/attendance/assignation/${assignationId}` , {withCredentials: true});
  }
  saveAllAttendance(attendance: AttendanceDTO[]){
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/attendance`,attendance,{withCredentials: true})
  }
  getAttendanceDatesByAssignationId(assignationId: number){
    return this.http.get<ResponseDTO<AttendanceDateDTO[]>>(`${this.API_URL}/attendance/assignation/${assignationId}/date`,{withCredentials:true})
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment.development";
import {ResponseDTO} from "../models/ResponseDTO";
import {ActivityGradeDTO} from "../models/ActivityGradeDTO";

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private API_URL = environment.API_URL;
  constructor(private http:HttpClient) { }

  getGradesByAssignation(assignationId:number, bimester: number){
    return this.http.get<ResponseDTO<{[key:number]:ActivityGradeDTO[]}>>(`${this.API_URL}/activityGrade/assignation/${assignationId}/${bimester}`, {withCredentials :true})
  }
  saveGradesBy(activityGradeDTO: ActivityGradeDTO[]){
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/activityGrade`, activityGradeDTO, {withCredentials :true})
  }
}

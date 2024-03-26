import { Injectable } from '@angular/core';
import {environment} from "../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {ResponseDTO} from "../models/ResponseDTO";
import {ActivityDTO} from "../models/ActivityDTO";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  getActivitiesByAssignationId(assignationId: number) : Observable<ResponseDTO<ActivityDTO[]>>{
    return this.http.get<ResponseDTO<ActivityDTO[]>>(`${this.API_URL}/activity/assignation/${assignationId}`, {withCredentials: true});
  }
  saveActivity(activity: ActivityDTO) : Observable<ResponseDTO<string>>{
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/activity`, activity, {withCredentials: true});
  }

  updateActivity(activity: ActivityDTO) : Observable<ResponseDTO<string>>{
    return this.http.put<ResponseDTO<string>>(`${this.API_URL}/activity`, activity, {withCredentials: true});
  }
  deleteActivity(id:number){
    return this.http.delete<ResponseDTO<string>>(`${this.API_URL}/activity/${id}`,{withCredentials:true})
  }
}

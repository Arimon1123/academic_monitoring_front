import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment.development";
import {ResponseDTO} from "../models/ResponseDTO";
import {AnnouncementDTO} from "../models/AnnouncementDTO";

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {
  }
  saveAnnouncement(announcement: FormData){
   return this.http.post<ResponseDTO<any>>(`${this.API_URL}/announcement`,announcement,{withCredentials: true} );
  }
  getAnnouncements(gradeId:number, receiver: string, shift:number ){
    return this.http.get<ResponseDTO<AnnouncementDTO[]>>(`${this.API_URL}/announcement/search`, {
      params: { gradeId:gradeId, receiver:receiver, shift:shift}, withCredentials: true});
  }
}

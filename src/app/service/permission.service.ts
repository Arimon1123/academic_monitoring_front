import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { PermissionCreateDTO } from '../models/PermissionCreateDTO';
import {PermissionDTO} from "../models/PermissionDTO";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  savePermission(permission: FormData) {
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/permission`, permission, { withCredentials: true });
  }
  getPermissionByStatus(statusId: number){
    return this.http.get<ResponseDTO<PermissionDTO[]>>(`${this.API_URL}/permission/status`, { params: {statusId: statusId}, withCredentials: true });
  }
}

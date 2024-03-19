import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  savePermission(permission: FormData) {
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/permission`, permission, { withCredentials: true });
  }
}

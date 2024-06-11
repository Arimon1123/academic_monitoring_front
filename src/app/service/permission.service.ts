import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { PermissionDTO } from '../models/PermissionDTO';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  savePermission(permission: FormData) {
    return this.http.post<ResponseDTO<string>>(
      `${this.API_URL}/permission`,
      permission,
      { withCredentials: true }
    );
  }
  getPermissionByStatus(statusId: number) {
    return this.http.get<ResponseDTO<PermissionDTO[]>>(
      `${this.API_URL}/permission/status`,
      { params: { statusId: statusId }, withCredentials: true }
    );
  }
  getPermissionById(permissionId: number) {
    return this.http.get<ResponseDTO<PermissionDTO>>(
      `${this.API_URL}/permission/${permissionId}`,
      { withCredentials: true }
    );
  }
  approvePermission(permissionId: number) {
    return this.http.put<ResponseDTO<string>>(
      `${this.API_URL}/permission/approve/${permissionId}`,
      null,
      { withCredentials: true }
    );
  }
  rejectPermission(permissionId: number, reason: string) {
    return this.http.put<ResponseDTO<string>>(
      `${this.API_URL}/permission/reject`,
      { reason: reason, permissionId: permissionId },
      { withCredentials: true }
    );
  }
  getPermissionsByClassId(classId: number) {
    return this.http.get<ResponseDTO<PermissionDTO[]>>(
      `${this.API_URL}/permission/class/${classId}`,
      { withCredentials: true }
    );
  }
  getPermissionByStudentId(studentIds: number[], year: number) {
    return this.http.get<ResponseDTO<PermissionDTO[]>>(
      `${this.API_URL}/permission/students`,
      { withCredentials: true, params: { studentId: studentIds, year: year } }
    );
  }
}

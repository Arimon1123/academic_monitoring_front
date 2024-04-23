import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ParentDTO } from '../models/ParentDTO';
import { TeacherDTO } from '../models/TeacherDTO';
import { ResponseDTO } from '../models/ResponseDTO';
import {UserDTO} from "../models/UserDTO";
import {UserDetailsDTO} from "../models/UserDetailsDTO";
import {UserDataDTO} from "../models/UserDataDTO";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  API_URL = environment.API_URL;

  createUser(formData: any) {
    return this.http.post(`${this.API_URL}/user`, formData, { responseType: 'json', withCredentials: true });
  }

  getUserList(search: any) {
    return this.http.get(`${this.API_URL}/user`, {
      params: {
        page: search.page,
        size: search.size,
        name: search.name,
        role: search.role,
        lastname: search.lastname,
        ci: search.ci
      }, responseType: 'json', withCredentials: true
    });
  }
  checkUsername(username: string) {
    return this.http.get(`${this.API_URL}/user/${username}/available`, { responseType: 'json', withCredentials: true });
  }


  blockUser(username: string) {
    return this.http.put(`${this.API_URL}/user/block/${username}`, null, { responseType: 'json', withCredentials: true });
  }

  unblockUser(username: string) {
    return this.http.put(`${this.API_URL}/user/unblock/${username}`, null, { responseType: 'json', withCredentials: true });
  }


  userDetails() {
    return this.http.get<ResponseDTO<UserDTO>>(`${this.API_URL}/auth/details`, { responseType: 'json', withCredentials: true });
  }
  getUser(id: number) {
    return this.http.get<ResponseDTO<UserDataDTO>>(`${this.API_URL}/user/${id}`, { responseType: 'json', withCredentials: true });
  }
  updateUser(user: any) {
    return this.http.put(`${this.API_URL}/user`, user, { responseType: 'json', withCredentials: true });
  }
  getUserRoleDetails(role: string) {
    return this.http.get<ResponseDTO<UserDetailsDTO>>(`${this.API_URL}/auth/role`, { responseType: 'json', withCredentials: true, params: { role: role } });
  }
  getUserByPersonId(id: number) {
    return this.http.get<ResponseDTO<UserDTO>>(`${this.API_URL}/user/person/${id}`, { responseType: 'json', withCredentials: true });
  }
}

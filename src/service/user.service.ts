import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  createUser(formData: any) {
    return this.http.post(`${environment.API_URL}/user`, formData, { responseType: 'json', withCredentials: true });
  }

  getUserList() {
    return this.http.get(`${environment.API_URL}/user?role=`, { responseType: 'json', withCredentials: true });
  }
  checkUsername(username: string) {
    return this.http.get(`${environment.API_URL}/user/${username}/available`, { responseType: 'json', withCredentials: true });
  }
  blockUser(id: number) {

  }
  userDetails() {
    return this.http.get(`${environment.API_URL}/auth/details`, { responseType: 'json', withCredentials: true });
  }
}

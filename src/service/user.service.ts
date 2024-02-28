import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';


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
  blockUser(id: number) {

  }
  userDetails() {
    return this.http.get(`${this.API_URL}/auth/details`, { responseType: 'json', withCredentials: true });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.API_URL + "/auth";

  constructor(private http: HttpClient) { }

  login(user: any) {
    return this.http.post(`${this.API_URL}/authenticate`, user, { responseType: 'text', withCredentials: true })
  }

  logout() {
    return this.http.get(`${this.API_URL}/logout`, { responseType: 'text', withCredentials: true });
  }
  isLoggedIn() {
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged) {
      return true;
    }
    return false;
  }
}



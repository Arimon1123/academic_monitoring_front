import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.API_URL + "/auth";

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  login(user: any) {
    return this.http.post(`${this.API_URL}/authenticate`, user, { responseType: 'text', withCredentials: true })
  }

  logout() {
    return this.http.get(`${this.API_URL}/logout`, { responseType: 'text', withCredentials: true });
  }
  isLoggedIn() {
    const isLogged = this.localStorageService.getItem('isLogged');
    if (isLogged) {
      return true;
    }
    return false;
  }
}



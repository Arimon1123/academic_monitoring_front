import { Injectable } from '@angular/core';
import {UserDTO} from "../models/UserDTO";
import {AdministrativeDTO} from "../models/AdministrativeDTO";
import {ParentDTO} from "../models/ParentDTO";
import {TeacherDTO} from "../models/TeacherDTO";
import {StudentDTO} from "../models/StudentDTO";
import {AssignationDTO} from "../models/AssignationDTO";
import {UserDetailsDTO} from "../models/UserDetailsDTO";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userDetails: UserDetailsDTO | undefined;
  constructor(private localStorage: LocalStorageService) {

  }
  getUserDetails(): UserDetailsDTO | undefined{
    return this.userDetails;
  }
  setUserDetails(userDetails: UserDetailsDTO) {
    this.userDetails = userDetails;
    this.localStorage.setItem('userDetails', JSON.stringify(userDetails));
  }

}

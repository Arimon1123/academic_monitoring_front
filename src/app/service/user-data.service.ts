import { Injectable } from '@angular/core';

import {UserDetailsDTO} from "../models/UserDetailsDTO";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userDetails: BehaviorSubject<UserDetailsDTO | null> = new BehaviorSubject<UserDetailsDTO | null>(null);
  currentUser = this.userDetails.asObservable();
  constructor() {

  }

  setUserDetails(userDetails: UserDetailsDTO) {
   this.userDetails.next(userDetails);
  }

}

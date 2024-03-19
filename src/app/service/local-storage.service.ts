import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: string) {
    const encryptedValue = CryptoJS.AES.encrypt(value, environment.storageSecret).toString();
    console.log(encryptedValue)
    localStorage.setItem(key, encryptedValue);
  }
  getItem(key: string) {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(CryptoJS.AES.decrypt(value, environment.storageSecret).toString(CryptoJS.enc.Utf8))
      return CryptoJS.AES.decrypt(value, environment.storageSecret).toString(CryptoJS.enc.Utf8);
    } else {
      return null;

    }
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationDTO } from '../models/ConfigurationDTO';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationDataService {
  constructor() {}
  private config: BehaviorSubject<ConfigurationDTO | null> =
    new BehaviorSubject<ConfigurationDTO | null>(null);
  currentConfig = this.config.asObservable();

  setConfig(config: ConfigurationDTO) {
    this.config.next(config);
  }
}

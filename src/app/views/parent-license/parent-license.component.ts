import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../service/permission.service';
import { UserDataService } from '../../service/user-data.service';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { DatePipe, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PermissionDTO } from '../../models/PermissionDTO';

@Component({
  selector: 'app-parent-license',
  standalone: true,
  imports: [DatePipe, RouterLink, NgStyle],
  templateUrl: './parent-license.component.html',
  styleUrl: './parent-license.component.css',
})
export class ParentLicenseComponent implements OnInit {
  userData: UserDetailsDTO | undefined;
  configuration: ConfigurationDTO | undefined;
  permissionList: PermissionDTO[] = [];
  permissionStatusDict: { [key: number]: string } = {
    0: 'Pendiente',
    1: 'Aprobada',
    2: 'Rechazada',
  };
  constructor(
    private permissionService: PermissionService,
    private userDataService: UserDataService,
    private confDatService: ConfigurationDataService
  ) {}

  ngOnInit() {
    this.getUserData();
    this.getConfiguration();
  }
  getUserData() {
    this.userDataService.currentUser.subscribe({
      next: user => {
        this.userData = user!;
      },
    });
  }
  getConfiguration() {
    this.confDatService.currentConfig.subscribe({
      next: conf => {
        this.configuration = conf!;
        this.getPermissions();
      },
    });
  }
  getPermissions() {
    let studentIds: number[] = [];
    if (this.userData?.role === 'PARENT') {
      studentIds = this.userData.students.map(student => student.id);
    }
    console.log(studentIds);
    this.permissionService
      .getPermissionByStudentId(studentIds, this.configuration!.currentYear)
      .subscribe({
        next: response => {
          this.permissionList = response.content;
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../service/permission.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { PermissionDTO } from '../../models/PermissionDTO';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.css',
})
export class PermissionListComponent implements OnInit {
  permissionList: PermissionDTO[];
  constructor(private permissionService: PermissionService) {
    this.permissionList = [];
  }
  ngOnInit() {
    this.permissionService.getPermissionByStatus(0).subscribe({
      next: (data: ResponseDTO<PermissionDTO[]>) => {
        this.permissionList = data.content.map((permission: PermissionDTO) => {
          permission.date = new Date(permission.date);
          permission.permissionEndDate = new Date(permission.permissionEndDate);
          permission.permissionStartDate = new Date(
            permission.permissionStartDate,
          );
          console.log(permission);
          return permission;
        });
      },
    });
  }
}

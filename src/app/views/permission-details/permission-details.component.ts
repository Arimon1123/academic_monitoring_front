import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PermissionDTO} from "../../models/PermissionDTO";
import {PermissionService} from "../../service/permission.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-permission-details',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './permission-details.component.html',
  styleUrl: './permission-details.component.css'
})
export class PermissionDetailsComponent {
  permissionId: number;
  permissionDTO: PermissionDTO;
  reason: string;
  constructor(private route: ActivatedRoute, private permissionService: PermissionService){
    this.reason = ""
    this.permissionDTO = {} as PermissionDTO;
    this.permissionId = 0;
    this.route.params.subscribe(params => {
      this.permissionId = params['id'];
    });
  }
  ngOnInit(){
    this.getPermission();

  }
  getPermission(){
    this.permissionService.getPermissionById(this.permissionId).subscribe({
      next: (data: ResponseDTO<PermissionDTO>) => {
        this.permissionDTO = data.content;
        this.permissionDTO.permissionStartDate = new Date(this.permissionDTO.permissionStartDate);
        this.permissionDTO.permissionEndDate = new Date(this.permissionDTO.permissionEndDate);
        this.permissionDTO.date = new Date(this.permissionDTO.date);
        console.log(this.permissionDTO);
      }
    })
  }
  approvePermission(){
    this.permissionService.approvePermission(this.permissionId).subscribe(
      {
        next:((data: ResponseDTO<string>)=> {
          alert(data.message)
        }),
        error: ((error:any) => {
          console.log(error)
        })
      }
    )
  }
  rejectPermission(){
    this.permissionService.rejectPermission(this.permissionId, this.reason).subscribe({
      next: ((data:ResponseDTO<string> ) => {
        alert(data.message);
      }),
      error: ((error:any) =>{
        console.log(error)
      })
    })
  }
}

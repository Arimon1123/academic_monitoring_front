import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-permission-details',
  standalone: true,
  imports: [],
  templateUrl: './permission-details.component.html',
  styleUrl: './permission-details.component.css'
})
export class PermissionDetailsComponent {
  permissionId: number;
  constructor(private route: ActivatedRoute){
    this.permissionId = 0;
    this.route.params.subscribe(params => {
      this.permissionId = params['id'];
    });
  }
  ngOnInit(){

  }
}

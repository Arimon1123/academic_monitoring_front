import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  userList: UserDataDTO[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserList().subscribe((data: any) => {
      console.log(data);
  
      this.userList = data.content;
    });
  }

}

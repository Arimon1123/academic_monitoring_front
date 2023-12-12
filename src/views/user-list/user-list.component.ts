import { Component } from '@angular/core';
import { UserCreateDTO } from '../../models/userCreateDTO';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  userList: UserCreateDTO[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserList().subscribe((data: any) => {
      console.log(data);
      this.userList = data;
    });
  }

}

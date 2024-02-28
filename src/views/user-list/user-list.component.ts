import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  currentRoles: { [key: string]: any } = {
    ADMINISTRATIVE: 'Administrativo',
    TEACHER: 'Profesor',
    FATHER: 'Padre'
  }
  requestSend = false;
  firstRequest = true;
  totalPages = 0;
  currentPage = 1;
  searchForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', []),
      lastname: new FormControl('', []),
      ci: new FormControl('', []),
      role: new FormControl('ADMINISTRATIVE', [])
    }

  );
  userList: UserDataDTO[] = [];
  constructor(private userService: UserService) { }

  // ngOnInit(): void {
  //   this.userService.getUserList().subscribe((data: any) => {
  //     console.log(data);
  //     this.userList = data.content.content;
  //   });
  // }
  onSearch() {
    this.requestSend = true;
    const search = { ...this.searchForm.value, page: this.currentPage - 1, size: 1 };

    console.log(search);
    this.userService.getUserList(search).subscribe({
      next: (data: any) => {
        console.log(data);
        this.userList = data.content.content;
        this.totalPages = data.content.totalPages;
        this.currentPage = data.content.number + 1;
      },
      error: (error: any) => {
        this.requestSend = false;
        console.error(error);
      },
      complete: () => {
        this.firstRequest = false;
        this.requestSend = false;
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.userList = [];
      this.firstRequest = true;
      this.currentPage++;
      this.onSearch();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.userList = [];
      this.firstRequest = true;
      this.currentPage--;
      this.onSearch();
    }
  }
  // blockUser(id: number) {
  //   this.userService.blockUser(id).subscribe((data: any) => {
  //     alert("Usuario bloqueado");
  //   });
  // }
  // deleteUser(id: number) {
  //   this.userService.deleteUser(id).subscribe((data: any) => {
  //     alert("Usuario eliminado");
  //   });
  // }

}

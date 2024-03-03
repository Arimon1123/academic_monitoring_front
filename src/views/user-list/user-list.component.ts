import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { Flowbite } from '../../decorator/flowbite';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
@Flowbite()
export class UserListComponent implements OnInit {

  ngOnInit() {

  }
  @ViewChild("modal") modalComponent: ModalComponent | undefined;
  search: any = {}
  blockUsername: string = '';
  currentRoles: { [key: string]: string } = environment.currentRoles;
  requestSend = false;
  firstRequest = true;
  totalPages = 0;
  currentPage = 1;
  message = '';
  isForBlock = false;
  searchForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', []),
      lastname: new FormControl('', []),
      ci: new FormControl('', []),
      role: new FormControl('ADMINISTRATIVE', [])
    }

  );
  userList: UserDataDTO[] = [];
  constructor(private userService: UserService, private router: Router) {

  }


  onSearch() {
    this.requestSend = true;
    if ((this.search.role !== this.searchForm.value.role)
      || (this.search.name !== this.searchForm.value.name)
      || (this.search.lastname !== this.searchForm.value.lastname)
      || (this.search.ci !== this.searchForm.value.ci)) {
      this.currentPage = 1;
    }
    this.search = { ...this.searchForm.value, page: this.currentPage - 1, size: 10 };
    this.userList = [];
    console.log(this.search);
    this.userService.getUserList(this.search).subscribe({
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

  closeModal() {
    this.modalComponent?.toggleModal();
  }

  blockAction() {
    if (this.isForBlock)
      this.blockUser();
    else
      this.unblockUser();


  }
  blockUser() {
    this.userService.blockUser(this.blockUsername).subscribe(
      {
        next: (data: any) => {

          this.onSearch();
          this.modalComponent?.toggleModal();
        },
        error: (error: any) => {
          this.modalComponent?.toggleModal();
        }
      }
    );
  }
  unblockUser() {
    this.userService.unblockUser(this.blockUsername).subscribe(
      {
        next: (data: any) => {
          this.modalComponent?.toggleModal();
          this.onSearch();
        },
        error: (error: any) => {
          this.modalComponent?.toggleModal();
        }
      }
    );
  }
  showBlockModal(username: string, status: number) {
    this.blockUsername = username;
    if (status === 1) {
      this.isForBlock = true;
      this.message = 'Esta seguro que desea bloquear este usuario?';
    }
    else {
      this.isForBlock = false;
      this.message = 'Esta seguro que desea desbloquear este usuario?';
    }
    this.modalComponent?.toggleModal();
  }
  editUser(id: number) {
    window.location.href = `/editUser/${id}`;
  }

}

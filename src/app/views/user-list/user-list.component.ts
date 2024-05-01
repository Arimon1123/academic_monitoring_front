import { Component, TemplateRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../service/modal.service';
import { role_names } from '../../consts/roles.json';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    RouterLink,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  search: {
    page: number;
    size: number;
    role: string;
    name: string;
    lastname: string;
    ci: string;
  };
  blockUsername: string = '';
  currentRoles: { [key: string]: string } = role_names;
  requestSend = false;
  firstRequest = true;
  totalPages = 0;
  currentPage = 1;
  isForBlock = false;
  searchForm: FormGroup;
  userList: UserDataDTO[] = [];
  constructor(
    private userService: UserService,
    private modalService: ModalService
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl('', []),
      lastname: new FormControl('', []),
      ci: new FormControl('', []),
      role: new FormControl('ADMINISTRATIVE', []),
    });
    this.search = {
      page: 0,
      size: 10,
      role: 'ADMINISTRATIVE',
      name: '',
      lastname: '',
      ci: '',
    };
  }
  onSearch() {
    this.requestSend = true;
    if (!this.search) return;
    if (
      this.search.role !== this.searchForm.value.role ||
      this.search.name !== this.searchForm.value.name ||
      this.search.lastname !== this.searchForm.value.lastname ||
      this.search.ci !== this.searchForm.value.ci
    ) {
      this.currentPage = 1;
    }
    this.search = {
      ...this.searchForm.value,
      page: this.currentPage - 1,
      size: 10,
    };
    this.userList = [];
    console.log(this.search);
    this.userService.getUserList(this.search!).subscribe({
      next: data => {
        console.log(data);
        this.userList = data.content.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number + 1;
      },
      error: (error: HttpErrorResponse) => {
        this.requestSend = false;
        console.error(error);
      },
      complete: () => {
        this.firstRequest = false;
        this.requestSend = false;
      },
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
  blockAction() {
    if (this.isForBlock) this.blockUser();
    else this.unblockUser();
  }
  blockUser() {
    this.userService.blockUser(this.blockUsername).subscribe({
      next: () => {
        this.onSearch();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.message);
      },
    });
  }
  unblockUser() {
    this.userService.unblockUser(this.blockUsername).subscribe({
      next: () => {
        this.onSearch();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.message);
      },
    });
  }

  openModal(modalTemplate: TemplateRef<unknown>, user: UserDataDTO) {
    this.blockUsername = user.username;
    this.isForBlock = user.status === 1;
    const message = this.isForBlock
      ? 'Esta seguro que desea bloquear este usuario?'
      : 'Esta seguro que desea desbloquear este usuario?';
    const title = this.isForBlock ? 'Bloquear Usuario' : 'Desbloquear Usuario';
    this.modalService
      .open({
        content: modalTemplate,
        options: {
          size: 'small',
          title: title,
          message: message,
          isSubmittable: true,
        },
      })
      .subscribe({
        next: (data: string) => {
          if (data === 'submit') {
            this.blockAction();
          }
        },
      });
  }
}

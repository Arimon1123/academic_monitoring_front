import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserCardComponent } from '../../components/user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    RouterLink,
    NgOptimizedImage,
    UserCardComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
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
  queryParams: Params | undefined;
  roleColor: { [key: string]: string };
  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.roleColor = {
      ADMINISTRATIVE: 'bg-teal-600',
      TEACHER: 'bg-cyan-600',
      PARENT: 'bg-sky-600',
    };
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
    this.searchForm.get('name')?.valueChanges.subscribe({
      next: value => {
        this.router.navigate([], {
          queryParams: (this.queryParams = {
            ...this.queryParams,
            name: value,
          }),
        });
      },
    });
    this.searchForm.get('lastname')?.valueChanges.subscribe({
      next: value => {
        this.router.navigate([], {
          queryParams: (this.queryParams = {
            ...this.queryParams,
            lastname: value,
          }),
        });
      },
    });
    this.searchForm.get('ci')?.valueChanges.subscribe({
      next: value => {
        this.router.navigate([], {
          queryParams: (this.queryParams = {
            ...this.queryParams,
            ci: value,
          }),
        });
      },
    });
    this.searchForm.get('role')?.valueChanges.subscribe({
      next: value => {
        this.queryParams = {
          ...this.queryParams,
          role: value,
        };
      },
    });
  }
  ngOnInit() {
    this.getSearchParamsFromUrl().then(() => {
      this.setFormValuesFromParams(this.queryParams ?? {});
    });
  }
  async getSearchParamsFromUrl() {
    const params = await firstValueFrom(this.activeRoute.queryParams);
    this.queryParams = params;
    console.log(params);
  }
  setFormValuesFromParams(params: Params) {
    const paramValues = {
      name: params['name'] ?? '',
      lastname: params['lastname'] ?? '',
      role: params['role'] ?? '',
      ci: params['ci'] ?? '',
    };
    this.searchForm.setValue(paramValues);
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
    this.userService.getUserList(this.search!).subscribe({
      next: data => {
        console.log(data.content);
        this.userList = data.content.content;
        this.totalPages = data.content.totalPages;
        this.currentPage = data.content.number + 1;
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

import {Component,  TemplateRef, ViewChild} from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { Flowbite } from '../../decorator/flowbite';
import {ModalService} from "../../service/modal.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
@Flowbite()
export class UserListComponent{

  search: any = {}
  blockUsername: string = '';
  currentRoles: { [key: string]: string } = environment.currentRoles;
  requestSend = false;
  firstRequest = true;
  totalPages = 0;
  currentPage = 1;
  isForBlock = false;
  searchForm: FormGroup;
  userList: UserDataDTO[] = [];
  constructor(private userService: UserService, private modalService: ModalService){
    this.searchForm = new FormGroup(
      {
        name: new FormControl('', []),
        lastname: new FormControl('', []),
        ci: new FormControl('', []),
        role: new FormControl('ADMINISTRATIVE', [])
      });

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

        },
        error: (error: any) => {

        }
      }
    );
  }
  unblockUser() {
    this.userService.unblockUser(this.blockUsername).subscribe(
      {
        next: (data: any) => {

          this.onSearch();
        },
        error: (error: any) => {

        }
      }
    );
  }
  showBlockModal(username: string, status: number) {

  }
  editUser(id: number) {
    window.location.href = `/editUser/${id}`;
  }
  openModal(modalTemplate: TemplateRef<any>, user: UserDataDTO) {
    this.blockUsername = user.username;
    this.isForBlock = user.status === 1;
    const message  = this.isForBlock ? 'Esta seguro que desea bloquear este usuario?' : 'Esta seguro que desea desbloquear este usuario?';
    const title = this.isForBlock ? 'Bloquear Usuario' : 'Desbloquear Usuario';
    this.modalService.open({content:modalTemplate,options:
        {size: 'small', title:title, message: message, isSubmittable: true}})
      .subscribe({
        next: (data: any) => {
          if(data === 'submit'){
            this.blockAction();
          }
        }
      });
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionDTO } from '../../models/PermissionDTO';
import { PermissionService } from '../../service/permission.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../service/modal.service';
import { ImageCarrouselComponent } from '../../components/image-carrousel/image-carrousel.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-permission-details',
  standalone: true,
  imports: [DatePipe, NgOptimizedImage, FormsModule, ImageCarrouselComponent],
  templateUrl: './permission-details.component.html',
  styleUrl: './permission-details.component.css',
})
export class PermissionDetailsComponent implements OnInit {
  permissionId: number;
  permissionDTO: PermissionDTO;
  reason: string;
  @ViewChild('acceptModal') content: TemplateRef<unknown> | undefined;
  @ViewChild('rejectModal') rejectContent: TemplateRef<unknown> | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService,
    private modalService: ModalService,
  ) {
    this.reason = '';
    this.permissionDTO = {} as PermissionDTO;
    this.permissionId = 0;
    this.route.params.subscribe((params) => {
      this.permissionId = params['id'];
    });
  }
  ngOnInit() {
    this.getPermission();
  }
  getPermission() {
    this.permissionService.getPermissionById(this.permissionId).subscribe({
      next: (data: ResponseDTO<PermissionDTO>) => {
        this.permissionDTO = data.content;
        this.permissionDTO.permissionStartDate = new Date(
          this.permissionDTO.permissionStartDate,
        );
        this.permissionDTO.permissionEndDate = new Date(
          this.permissionDTO.permissionEndDate,
        );
        this.permissionDTO.date = new Date(this.permissionDTO.date);
        console.log(this.permissionDTO);
      },
    });
  }
  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        isSubmittable: false,
        title: title,
        message: message,
      },
    });
  }
  approvePermission() {
    this.permissionService.approvePermission(this.permissionId).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Permiso Aceptado', data.message);
      },
      error: (error: HttpErrorResponse) => {
        this.openModal('Error', error.message);
      },
      complete: () => {
        this.router.navigate(['/permissionList']);
      },
    });
  }
  rejectPermission() {
    this.permissionService
      .rejectPermission(this.permissionId, this.reason)
      .subscribe({
        next: (data: ResponseDTO<string>) => {
          this.openModal('Permiso Rechazado', data.message);
        },
        error: (error: HttpErrorResponse) => {
          this.openModal('Error', error.message);
        },
        complete: () => {
          this.router.navigate(['/permissionList']);
        },
      });
  }

  rejectPermissionModal() {
    this.modalService
      .open({
        content: this.rejectContent!,
        options: {
          size: 'medium',
          isSubmittable: true,
          title: 'Permiso Rechazado',
          hasContent: true,
          message: 'Por favor, ingrese el motivo de rechazo',
        },
      })
      .subscribe({
        next: (data: string) => {
          this.reason = data;
          this.rejectPermission();
        },
      });
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ImageInputComponent } from '../../components/image-input/image-input.component';
import { ImageDTO } from '../../models/ImageDTO';
import { ImageCarrouselComponent } from '../../components/image-carrousel/image-carrousel.component';
import { AnnouncementService } from '../../service/announcement.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AnnouncementDTO } from '../../models/AnnouncementDTO';
import { GradeService } from '../../service/grade.service';
import { GradeDTO } from '../../models/GradeDTO';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-announcement-register',
  standalone: true,
  imports: [ImageInputComponent, ImageCarrouselComponent, ReactiveFormsModule],
  templateUrl: './announcement-register.component.html',
  styleUrl: './announcement-register.component.css',
})
export class AnnouncementRegisterComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  imageList: ImageDTO[];
  gradeList: GradeDTO[];
  announcementForm: FormGroup;
  constructor(
    private announcementService: AnnouncementService,
    private gradeService: GradeService,
    private modalService: ModalService
  ) {
    this.imageList = [];
    this.gradeList = [];
    this.announcementForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.maxLength(250),
      ]),
      publishingDate: new FormControl('', [Validators.required]),
      receiver: new FormControl('', [Validators.required]),
      primarySection: new FormControl('', [Validators.required]),
      highSchoolSection: new FormControl('', [Validators.required]),
      shift: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit() {
    this.getGrades();
  }
  onUpdateImages(imageList: ImageDTO[]) {
    this.imageList = imageList;
    console.log(this.imageList.length);
  }
  saveAnnouncement() {
    let announcement: AnnouncementDTO = {} as AnnouncementDTO;
    const primaryIds = this.gradeList
      .filter(v => {
        return v.section === 'Primaria';
      })
      .map(v => v.id);
    const highSchoolIds = this.gradeList
      .filter(v => {
        return v.section === 'Secundaria';
      })
      .map(v => v.id);
    console.log(primaryIds);
    let gradesIds: number[] = [];
    gradesIds = [
      ...(this.announcementForm.get('primarySection')?.value ? primaryIds : []),
    ];
    gradesIds = [
      ...gradesIds,
      ...(this.announcementForm.get('highSchoolSection')?.value
        ? highSchoolIds
        : []),
    ];
    announcement = {
      id: 0,
      title: this.announcementForm.get('title')?.value,
      message: this.announcementForm.get('message')?.value,
      date: new Date(),
      publishingDate: new Date(
        this.announcementForm.get(`publishingDate`)?.value
      ),
      receivers: JSON.stringify({
        receiver: this.announcementForm.get('receiver')?.value,
        grade: gradesIds,
        shift: this.announcementForm.get('shift')?.value,
      }),
      images: [],
    };
    console.log(announcement);
    const formData = new FormData();
    formData.append('announcement', JSON.stringify(announcement));
    this.imageList.forEach((image: ImageDTO) => {
      formData.append('images', image.image as Blob);
    });
    this.announcementService.saveAnnouncement(formData).subscribe({
      next: value => {
        console.log(value.message);
        this.modalService.open({
          content: this.content!,
          options: {
            size: 'small',
            title: 'Anuncio registrado',
            message: value.message,
            isSubmittable: false,
          },
        });
      },
    });
  }
  getGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: (data: ResponseDTO<GradeDTO[]>) => {
        this.gradeList = data.content;
      },
    });
  }
}

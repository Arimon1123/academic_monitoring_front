import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ClassListDTO } from '../../models/ClassListDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassService } from '../../service/class.service';
import { GradeService } from '../../service/grade.service';
import { GradeDTO } from '../../models/GradeDTO';
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-class-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './class-select.component.html',
  styleUrl: './class-select.component.css',
})
export class ClassSelectComponent implements OnInit {
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;
  @Output() classEmitter = new EventEmitter<number>();
  classList: ClassListDTO[] = [];
  gradeList: GradeDTO[] = [];
  config: ConfigurationDTO = {} as ConfigurationDTO;
  constructor(
    private classService: ClassService,
    private gradeService: GradeService,
    private confDataService: ConfigurationDataService,
    private modalService: ModalService
  ) {}
  ngOnInit() {
    this.confDataService.currentConfig.subscribe({
      next: value => {
        this.config = value!;
        this.gradeService.getAllGrades().subscribe({
          next: value => {
            this.gradeList = value.content;
          },
        });
      },
    });
  }

  searchClass(event: Event) {
    const gradeId = parseInt((event.target as HTMLInputElement).value);
    const year = this.config.currentYear;
    const shift = 1;
    this.classService
      .getClassListByGradeIdAndYearAndShift(gradeId, year, shift)
      .subscribe({
        next: (data: ResponseDTO<ClassListDTO[]>) => {
          this.classList = data.content;
        },
        error: (error: HttpErrorResponse) => {
          this.openModal('Error', error.error.message);
        },
      });
  }
  onUpdateClassSelectHandler(event: Event) {
    const classId = parseInt((event.target as HTMLInputElement).value);
    this.classEmitter.emit(classId);
  }
  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        size: 'small',
        hasContent: false,
        isSubmittable: false,
        title: title,
        message: message,
        isClosable: true,
      },
    });
  }
}

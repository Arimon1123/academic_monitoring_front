import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { GradeDTO } from '../../models/GradeDTO';
import { ClassListDTO } from '../../models/ClassListDTO';
import { GradeService } from '../../service/grade.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ClassService } from '../../service/class.service';
import { ReportCardService } from '../../service/reportcard.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-report-cards',
  standalone: true,
  imports: [FormsModule, NgStyle, NgClass, ReactiveFormsModule],
  templateUrl: './report-cards.component.html',
  styleUrl: './report-cards.component.css',
})
export class ReportCardsComponent implements OnInit {
  @ViewChild('modal') modal: TemplateRef<unknown> | undefined;
  @ViewChild('bimester') bimesterEl: ElementRef | undefined;
  @ViewChild('classes') classesEl: ElementRef | undefined;
  gradeList: GradeDTO[];
  classList: ClassListDTO[];
  selectedClass: number[];
  selectedGradeId: number;
  bimester: number;
  isFinalReport: boolean;
  bimesterForm: FormGroup;
  constructor(
    private gradeService: GradeService,
    private classService: ClassService,
    private reportCardService: ReportCardService,
    private modalService: ModalService
  ) {
    this.gradeList = [];
    this.classList = [];
    this.selectedClass = [];
    this.bimester = 1;
    this.isFinalReport = false;
    this.selectedGradeId = 0;
    this.bimesterForm = new FormGroup({
      bimester: new FormControl(1, [Validators.required]),
    });
    this.bimesterForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }
  ngOnInit() {
    this.getGradeList();
  }
  getGradeList() {
    this.gradeService.getAllGrades().subscribe({
      next: (value: ResponseDTO<GradeDTO[]>) => {
        this.gradeList = value.content;
      },
    });
  }
  getClassList(gradeId: number) {
    this.selectedClass = [];
    this.selectedGradeId = gradeId;
    const year = new Date().getFullYear();
    this.classService
      .getClassListByGradeIdAndYearAndShift(gradeId, year, 1)
      .subscribe({
        next: (value: ResponseDTO<ClassListDTO[]>) => {
          this.classList = value.content;
        },
        complete: () => {
          setTimeout(() => {
            this.classesEl?.nativeElement.scrollIntoView({
              behavior: 'smooth',
            });
          }, 250);
        },
      });
  }
  addSelectedClass(event: Event) {
    const target = event.target as HTMLInputElement;
    const newId = parseInt(target.value);
    if (target.checked) {
      this.selectedClass.push(newId);
    } else {
      this.selectedClass = this.selectedClass.filter(id => {
        return id != newId;
      });
    }
    console.log(this.selectedClass);
    setTimeout(() => {
      this.classesEl?.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }, 250);
  }
  onDownloadReportCardsHandler() {
    if (this.isFinalReport) this.bimester = 4;
    this.openModal();
    this.reportCardService
      .generateReportCards(
        this.selectedClass,
        this.bimesterForm.value.bimester,
        this.isFinalReport
      )
      .subscribe({
        next: value => {
          const blob = new Blob([value], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = 'notas.zip';
          anchor.href = url;
          anchor.click();
        },
      });
  }
  onFinalReportChange(event: Event) {
    this.isFinalReport = (event.target as HTMLInputElement).checked;
    if (this.isFinalReport) {
      this.bimesterForm.setValue({ bimester: '4' });
      this.bimesterForm.updateValueAndValidity();
    } else {
      this.bimesterForm.setValue({ bimester: '1' });
      this.bimesterForm.updateValueAndValidity();
    }
  }
  getStyles(id: number) {
    return {
      'bg-active': this.selectedGradeId === id,
      'text-white': this.selectedGradeId === id,
      'bg-slate-200': this.selectedGradeId !== id,
    };
  }
  openModal() {
    return this.modalService.open({
      content: this.modal!,
      options: {
        title: 'Boletas de notas',
        size: 'small',
        isSubmittable: false,
        message:
          'Las boletas de notas se están generando, por favor espere.\n' +
          'Se descargará un archivo zip con todas las boletas de notas.',
      },
    });
  }
}

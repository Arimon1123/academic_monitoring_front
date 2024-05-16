import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ClassListDTO } from '../../models/ClassListDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassService } from '../../service/class.service';
import { GradeService } from '../../service/grade.service';
import { GradeDTO } from '../../models/GradeDTO';

@Component({
  selector: 'app-class-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './class-select.component.html',
  styleUrl: './class-select.component.css',
})
export class ClassSelectComponent implements OnInit {
  @Output() classEmitter = new EventEmitter<number>();
  classList: ClassListDTO[] = [];
  gradeList: GradeDTO[] = [];
  constructor(
    private classService: ClassService,
    private gradeService: GradeService
  ) {}
  ngOnInit() {
    this.gradeService.getAllGrades().subscribe({
      next: value => {
        this.gradeList = value.content;
      },
    });
  }
  searchClass(event: Event) {
    const gradeId = parseInt((event.target as HTMLInputElement).value);
    const year = new Date().getFullYear();
    const shift = 1;
    this.classService
      .getClassListByGradeIdAndYearAndShift(gradeId, year, shift)
      .subscribe({
        next: (data: ResponseDTO<ClassListDTO[]>) => {
          this.classList = data.content;
        },
        error: (error: HttpErrorResponse) => {
          alert('Error al cargar las clases ' + error.error.message);
        },
      });
  }
  onUpdateClassSelectHandler(event: Event) {
    const classId = parseInt((event.target as HTMLInputElement).value);
    this.classEmitter.emit(classId);
  }
}

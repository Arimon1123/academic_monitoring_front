import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { SubjectDTO } from '../../models/SubjectDTO';
import { SubjectService } from '../../service/subject.service';
import { FormsModule } from '@angular/forms';
import { GradeDTO } from '../../models/GradeDTO';
import { GradeService } from '../../service/grade.service';

@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subject-selection.component.html',
  styleUrl: './subject-selection.component.css',
})
export class SubjectSelectionComponent implements OnInit, OnChanges {
  @Output() subjectEventEmitter = new EventEmitter<SubjectDTO[]>();
  subjectList: SubjectDTO[] = [];
  selectedGradeId = 1;
  @Input() selectedSubjects?: SubjectDTO[] = [];
  gradeList: GradeDTO[] = [];
  constructor(
    private subjectService: SubjectService,
    private gradeService: GradeService
  ) {}
  ngOnInit() {
    this.getGrades();
    this.getGradeSubjects(this.selectedGradeId);
  }
  ngOnChanges() {
    console.log(this.subjectList);
  }

  getGradeSubjects(gradeId: number) {
    this.subjectService.getSubjectsByGrade(gradeId).subscribe({
      next: subjects => {
        this.subjectList = subjects.content;
      },
    });
  }
  getGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: grades => {
        this.gradeList = grades.content;
      },
    });
  }
  onChangeGradeSelectHandler(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.getGradeSubjects(value);
  }
  onChangeSubjectSelectHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    const selectedSubject = this.subjectList!.find(subject => {
      return subject.id === value;
    });
    if (selectedSubject) {
      this.addSubject(selectedSubject);
      target.value = '0';
    } else alert('Subject not found');
  }
  addSubject(subject: SubjectDTO) {
    const isSubjectAlreadyAdded =
      this.selectedSubjects!.indexOf(subject) !== -1;
    if (isSubjectAlreadyAdded) alert('Subject already added');
    else {
      this.selectedSubjects!.push(subject);
      this.subjectEventEmitter.emit(this.selectedSubjects);
    }
  }
  removeSubject(subject: SubjectDTO) {
    this.selectedSubjects = this.selectedSubjects!.filter(
      subjectS => subjectS.id !== subject.id
    );
    this.subjectEventEmitter.emit(this.selectedSubjects);
  }
}

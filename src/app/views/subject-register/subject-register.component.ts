import { Component, OnInit, ViewChild } from '@angular/core';
import { GradeDTO } from '../../models/GradeDTO';
import { GradeService } from '../../service/grade.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { RequirementDTO } from '../../models/RequirementDTO';
import { RequirementsService } from '../../service/requirements.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectDTO } from '../../models/SubjectDTO';
import { SubjectService } from '../../service/subject.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-subject-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './subject-register.component.html',
  styleUrl: './subject-register.component.css'
})
export class SubjectRegisterComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent | undefined;
  gradeList: GradeDTO[] = [];
  requirementList: RequirementDTO[] = [];
  selectedRequirement: RequirementDTO[] = [];
  message: string = '';
  subjectForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    hours: new FormControl('', [Validators.required, Validators.min(1)]),
    grade: new FormControl('1', Validators.required),
    requirements: new FormControl('-1', Validators.required)
  });

  constructor(private gradeService: GradeService, private requirementService: RequirementsService, private subjectService: SubjectService) {

  }
  ngOnInit(): void {
    this.gradeService.getAllGrades().subscribe((data: ResponseDTO<GradeDTO[]>) => {
      this.gradeList = data.content;
    });
    this.requirementService.getAllRequirements().subscribe((data: ResponseDTO<RequirementDTO[]>) => {
      this.requirementList = data.content;
    });
  }

  onSubmit() {
    const subject: SubjectDTO = {
      id: null,
      name: this.subjectForm.value.name,
      hours: this.subjectForm.value.hours,
      gradeId: this.subjectForm.value.grade,
      requirements: [...this.selectedRequirement]
    }
    this.subjectService.saveSubject(subject).subscribe(
      {
        next: (data: ResponseDTO<string>) => {

          this.message = data.message;
          this.subjectForm.value.name = '';
          this.subjectForm.value.hours = '';
        },
        error: (error: any) => {
          console.error(error);
          this.message = error.error.message;
          this.openModal();
        },
        complete: () => {
          this.openModal();
        }
      }
    )
  }

  closeModal() {
    this.modal?.hideModal();
  }
  openModal() {
    this.modal?.showModal();
  }
  addRequirement($event: any) {
    const selectedRequirement = this.requirementList.find(r => r.id == $event.target.value);
    if (selectedRequirement) {
      this.selectedRequirement.push(selectedRequirement);
      this.requirementList = this.requirementList.filter(r => r.id != $event.target.value);
      this.subjectForm.controls['requirements'].setValue('-1');
      this.subjectForm.updateValueAndValidity();
    }
    console.log(this.selectedRequirement);
  }
  removeRequirement(id: number) {
    console.log(id);
    const requirement = this.selectedRequirement.find((r) => r.id === id);
    if (requirement) {
      console.log(requirement);
      this.selectedRequirement = this.selectedRequirement.filter((r) => r.id != id);
      this.requirementList.push(requirement);
    }
  }
}

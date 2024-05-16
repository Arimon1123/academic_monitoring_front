import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResponseDTO } from '../../models/ResponseDTO';
import { ParentDTO } from '../../models/ParentDTO';
import { ParentService } from '../../service/parent.service';

@Component({
  selector: 'app-parent-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './parent-search.component.html',
  styleUrl: './parent-search.component.css',
})
export class ParentSearchComponent {
  @Output() parentEventEmitter = new EventEmitter<ParentDTO>();
  parentForm = new FormGroup({
    ci: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  parentList: ParentDTO[] = [];
  constructor(private parentService: ParentService) {}
  searchParents() {
    const ci = this.parentForm.value.ci!;
    this.parentService.getParentByCi(ci).subscribe({
      next: (data: ResponseDTO<ParentDTO[]>) => {
        console.log(data.content);
        this.parentList = data.content;
      },
    });
  }
  addParent(parent: ParentDTO) {
    this.parentEventEmitter.emit(parent);
  }
}

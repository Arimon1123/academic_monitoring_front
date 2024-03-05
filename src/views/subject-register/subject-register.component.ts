import { Component } from '@angular/core';
import { GradeDTO } from '../../models/GradeDTO';

@Component({
  selector: 'app-subject-register',
  standalone: true,
  imports: [],
  templateUrl: './subject-register.component.html',
  styleUrl: './subject-register.component.css'
})
export class SubjectRegisterComponent {

  gradeList: GradeDTO[] = [];



}

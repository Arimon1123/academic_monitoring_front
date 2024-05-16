import { Component, Input, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { StudentDTO } from '../../models/StudentDTO';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.css',
})
export class StudentCardComponent implements OnInit {
  @Input() student: StudentDTO = {} as StudentDTO;
  @Input() showEditButton = false;
  ngOnInit() {
    console.log(this.student);
  }
}

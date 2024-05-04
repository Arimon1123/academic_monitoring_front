import { Component } from '@angular/core';
import { SubjectSelectionComponent } from '../../components/subject-selection/subject-selection.component';
import { ScheduleSelectionComponent } from '../../components/schedule-selection/schedule-selection.component';
import { ScheduleDTO } from '../../models/ScheduleDTO';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    SubjectSelectionComponent,
    ScheduleSelectionComponent,
    IconComponent,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  log(schedules: ScheduleDTO[]) {
    console.log(schedules);
  }
}

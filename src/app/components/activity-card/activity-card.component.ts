import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityDTO } from '../../models/ActivityDTO';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.css',
})
export class ActivityCardComponent {
  @Input() activity: ActivityDTO | undefined;
  @Output() updateEventEmitter = new EventEmitter<ActivityDTO>();
  @Output() deleteEventEmitter = new EventEmitter<ActivityDTO>();

  onUpdateEventHandler(activity: ActivityDTO) {
    this.updateEventEmitter.emit(activity);
  }
  onDeleteEventHandler(activity: ActivityDTO) {
    this.deleteEventEmitter.emit(activity);
  }
}

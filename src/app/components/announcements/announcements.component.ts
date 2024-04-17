import { Component } from '@angular/core';
import {AnnouncementDTO} from "../../models/AnnouncementDTO";
import {AnnouncementService} from "../../service/announcement.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css'
})
export class AnnouncementsComponent {
  announcements: AnnouncementDTO[];
  constructor(private announcementService: AnnouncementService) {
    this.announcements = [];
  }
  ngOnInit(){
    this.getAnnouncements();
  }
  getAnnouncements(){
    this.announcementService.getAnnouncements(1, 'PARENTS', 2).subscribe(
      {
        next: (response) => {
          this.announcements = response.content;
        },
        error: (error) => {
          console.error(error);
        }
      }
    )
  }
}

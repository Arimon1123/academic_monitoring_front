import { Component } from '@angular/core';
import {AnnouncementsComponent} from "../../components/announcements/announcements.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AnnouncementsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

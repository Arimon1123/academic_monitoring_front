import { Component, Input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { UserDataDTO } from '../../models/UserDataDTO';
import { RouterLink } from '@angular/router';
import { role_names } from '../../consts/roles.json';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgClass],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  @Input() user: UserDataDTO | undefined;
  @Input() isForEditing: boolean = false;
  roleColor: { [key: string]: string } = {
    ADMINISTRATIVE: 'bg-teal-600',
    TEACHER: 'bg-cyan-600',
    PARENT: 'bg-sky-600',
  };
  currentRoles: { [key: string]: string } = role_names;
}

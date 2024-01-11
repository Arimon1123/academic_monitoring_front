import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [trigger('slideInOut', [
    state('in', style({ transform: 'translate(0, 0)' })),
    state('out', style({ transform: 'translate(-10vw, 0)' })),
    transition('in <=> out', animate('400ms ease-in-out')),
  ]), trigger('slideInOut2', [
    state('in', style({ tra: '75%' })),
    state('out', style({ width: '100%' })),
    transition('in <=> out', animate('400ms ease-in-out')),
  ])]
})
export class AppComponent {
  title = 'frontend_academic_monitoring';
  constructor() { }

  sideMenuState = 'out';
  toggleMenu(menuState: string) {
    this.sideMenuState = menuState;
  }
}

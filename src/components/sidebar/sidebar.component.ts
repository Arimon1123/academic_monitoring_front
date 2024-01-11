import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [trigger('slideInOut', [
    state('in', style({ transform: 'translate3d(0, 0, 0)' })),
    state('out', style({ transform: 'translate3d(100%, 0, 0)' })),
    transition('in => out', animate('400ms ease-in-out')),
    transition('out => in', animate('400ms ease-in-out'))
  ])]
})
export class SidebarComponent {

  @Input() menuState: string = 'out';
  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
}

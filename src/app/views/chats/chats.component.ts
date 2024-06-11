import { Component, HostListener, OnInit } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { UserDataService } from '../../service/user-data.service';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [ChatComponent, ChatListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
})
export class ChatsComponent implements OnInit {
  receiverId: number = 0;
  userData: UserDetailsDTO = {} as UserDetailsDTO;
  showChat = false;
  constructor(
    private userDataService: UserDataService,
    private activeRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.activeRoute.params.subscribe({
      next: params => {
        this.receiverId = params['receiverId'];
      },
    });

    this.userDataService.currentUser.subscribe({
      next: response => {
        this.userData = response!;
      },
    });
  }
  onReceiverSelected(receiverId: number) {
    console.log('receiver id: ' + receiverId);
    this.receiverId = receiverId;
    if (screen.width <= 768) this.showChat = true;
  }
  onBackHandler(result: boolean) {
    console.log(result);
    if (result) this.showChat = false;
  }

  protected readonly screen = screen;
  protected readonly window = window;
}

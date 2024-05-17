import { Component, OnInit } from '@angular/core';
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
  }
}

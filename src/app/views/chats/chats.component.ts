import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { UserDataService } from '../../service/user-data.service';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';

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
  constructor(private userDataService: UserDataService) {}
  ngOnInit() {
    this.userDataService.currentUser.subscribe({
      next: (response) => {
        this.userData = response!;
      },
    });
  }

  onReceiverSelected(receiverId: number) {
    console.log('receiver id: ' + receiverId);
    this.receiverId = receiverId;
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { RxStompService } from '../../service/rx-stomp.service';
import { UserDataService } from '../../service/user-data.service';
import { UserDetailsDTO } from '../../models/UserDetailsDTO';
import { UserService } from '../../service/user.service';
import { UserDataDTO } from '../../models/UserDataDTO';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../service/chat.service';
import { ResponseDTO } from '../../models/ResponseDTO';
import { MessageDTO } from '../../models/MessageDTO';
import {
  DatePipe,
  formatDate,
  NgClass,
  NgOptimizedImage,
  NgStyle,
} from '@angular/common';
import { EnterTheViewportNotifierDirective } from '../../directives/view.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    NgStyle,
    NgClass,
    NgOptimizedImage,
    EnterTheViewportNotifierDirective,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnChanges {
  constructor(
    private stompService: RxStompService,
    private userDataService: UserDataService,
    private userService: UserService,
    private chatService: ChatService
  ) {}
  date: Date = new Date();
  messages: MessageDTO[] = [];
  userData: UserDetailsDTO = {} as UserDetailsDTO;
  receiverUser: UserDataDTO = {} as UserDataDTO;
  @Input() receiverId: number = 0;
  chatId: string = '';
  subscribingDestination: string = '';
  message: string = '';
  topicSubscription: Subscription = new Subscription();
  @Output() backEventEmitter = new EventEmitter<boolean>();
  ngOnChanges() {
    this.getReceiverUser(this.receiverId);
  }
  getReceiverUser(userId: number) {
    console.log('receiver user id: ' + userId);
    this.userService.getUser(userId).subscribe({
      next: response => {
        this.receiverUser = response.content;
      },
      complete: () => {
        this.getUserData();
      },
    });
  }
  getUserData() {
    this.userDataService.currentUser.subscribe({
      next: user => {
        this.userData = user!;
        this.buildDestination();
      },
    });
  }
  buildDestination() {
    if (this.userData.role === 'TEACHER') {
      this.chatId = this.userData.user.username + this.receiverUser.username;
    } else if (this.userData.role === 'PARENT') {
      this.chatId = this.receiverUser.username + this.userData.user.username;
    }
    this.subscribingDestination = '/topic/chat/' + this.chatId;
    console.log(this.chatId);
    this.subscribeToChat();
    this.getMessages();
  }

  subscribeToChat() {
    if (this.topicSubscription) {
      console.log('unsubscribing from chat');
      this.topicSubscription.unsubscribe();
    }
    console.log('subscribing to chat');
    this.topicSubscription = this.stompService
      .watch(this.subscribingDestination)
      .subscribe(message => {
        this.messages.unshift(JSON.parse(message.body));
      });
  }

  getMessages() {
    this.chatService.getChatMessages(this.chatId).subscribe({
      next: (data: ResponseDTO<MessageDTO[]>) => {
        this.messages = data.content;
        console.log(this.messages);
      },
    });
  }
  onSendMessage() {
    if (this.message.trim() === '') {
      return;
    }
    const message: MessageDTO = {
      id: 0,
      content: this.message,
      sender: this.userData.user.username,
      receiver: this.receiverUser.username,
      chatId: this.chatId,
      seen: false,
      date: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'es-ES', '-0400'),
    };
    this.stompService.publish({
      destination: '/app/chat',
      body: JSON.stringify(message),
    });
    this.message = '';
  }

  messageStyle(message: MessageDTO) {
    if (message.sender === this.userData.user.username) {
      return { 'align-self': 'flex-end', 'background-color': '#d3d3d3' };
    } else {
      return { 'align-self': 'flex-start', 'background-color': '#f0f0f0' };
    }
  }
  getDate(date: Date | string) {
    return formatDate(date, 'yyyy-MM-dd', 'es-ES', '-0400');
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSendMessage();
    }
  }
  messageName(message: MessageDTO) {
    if (message.sender === this.userData.user.username) {
      return (
        this.userData.details.person.name +
        ' ' +
        this.userData.details.person.lastname
      );
    } else {
      return this.receiverUser.name + ' ' + this.receiverUser.lastname;
    }
  }
  onMessageSeen(event: string, message: MessageDTO) {
    if (
      !message.seen &&
      event === 'VISIBLE' &&
      message.sender !== this.userData.user.username
    ) {
      message.seen = true;
      this.chatService.seenMessage(message).subscribe({});
    }
  }
  onBackButtonHandler() {
    this.backEventEmitter.emit(true);
  }
}

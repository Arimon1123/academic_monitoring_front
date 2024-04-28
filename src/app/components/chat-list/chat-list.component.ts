import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserDataDTO} from "../../models/UserDataDTO";
import {ChatService} from "../../service/chat.service";
import {LastMessageDTO} from "../../models/LastMessageDTO";
import {UserDetailsDTO} from "../../models/UserDetailsDTO";
import {environment} from "../../environments/environment.development";
import {DatePipe} from "@angular/common";
import {RxStompService} from "../../service/rx-stomp.service";

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  @Input() userData: UserDetailsDTO = {} as UserDetailsDTO;
  @Output() receiverEmitter = new EventEmitter<number>();
  lastMessageList: LastMessageDTO[] = [];
  protected API_URL = environment.API_URL;
  constructor(private chatService: ChatService,
              private rxStompService: RxStompService) {  }
  ngOnInit(){
    this.subscribeToNotifications();
    this.getLatestMessages();
  }
  subscribeToNotifications(){
    this.rxStompService.watch('/topic/notification/'+this.userData.user.username).subscribe(
      {
        next: (lastNotification)=>{
          let lastMessage = JSON.parse(lastNotification.body);
           this.lastMessageList = this.lastMessageList.map(message => {
              if(message.chatId === lastMessage.chatId){
                message = lastMessage;
              }
              return message;
            }).sort( (a,b) => {
              return (new Date(b.date).getTime() - new Date(a.date).getTime());
            })
            console.log(this.lastMessageList)
        }
      }
    )
  }
  getLatestMessages(){
    this.chatService.getLastMessages(this.userData.user.username).subscribe({
      next: (response) => {
        this.lastMessageList = response.content
      }
    })
  }
  onReceiverSelected(receiverId: number){
    console.log(receiverId);
    this.receiverEmitter.emit(receiverId);
  }
}

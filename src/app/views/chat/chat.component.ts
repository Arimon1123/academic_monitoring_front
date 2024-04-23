import { Component } from '@angular/core';
import {RxStompService} from "../../service/rx-stomp.service";
import {UserDataService} from "../../service/user-data.service";
import {UserDetailsDTO} from "../../models/UserDetailsDTO";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../service/user.service";
import {UserDataDTO} from "../../models/UserDataDTO";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  constructor(private stompService: RxStompService,
              private userDataService: UserDataService,
              private activeRoute:ActivatedRoute,
              private userService:UserService) {

  }
  messages :any [] = [];
  userData: UserDetailsDTO = {} as UserDetailsDTO;
  receiverUser: UserDataDTO = {} as UserDataDTO;
  receiverId: number = 0;
  chatId : string = '';
  subscribingDestination: string = '';
  ngOnInit(){
    this.activeRoute.params.subscribe({
      next: (params) => {
        this.receiverId = params['receiverId'];
        this.getReceiverUser(this.receiverId)
      }
    })
  }
  getReceiverUser(userId: number){
    console.log("receiver user id: " + userId)
    this.userService.getUser(userId).subscribe(
      {
        next: (response) => {
          this.receiverUser = response.content;
        },
        complete: () => {
          this.getUserData();
        }
      }
    );
  }
  getUserData(){
    this.userDataService.currentUser.subscribe(
      {
        next: (user) => {
          this.userData = user!;
          this.buildDestination();
        }
      }
    );
  }
  buildDestination(){
    if(this.userData.role === "TEACHER"){
      this.chatId = this.userData.user.username + this.receiverUser.username;
    }
    else if(this.userData.role === "PARENT"){
      this.chatId = this.receiverUser.username + this.userData.user.username ;
    }
    this.subscribingDestination = '/topic/chat/' + this.chatId;
    console.log(this.chatId);
    this.subscribeToChat();
  }

  subscribeToChat(){
    console.log("subscribing to chat")
    this.stompService.watch(this.subscribingDestination).subscribe((message) => {
      this.messages.push(message.body)
    });
  }

  onSendMessage(){
    const message =
      { id:0, content: 'Hello, STOMP',
        sender: this.userData.user.username,
        receiver: this.receiverUser.username,
        chatId: this.chatId,
        date: null};
    this.stompService.publish({destination: '/app/chat', body: JSON.stringify(message)});
  }

}

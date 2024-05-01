import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { MessageDTO } from '../models/MessageDTO';
import { LastMessageDTO } from '../models/LastMessageDTO';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getChatMessages(chatId: string) {
    return this.http.get<ResponseDTO<MessageDTO[]>>(
      `${this.API_URL}/chat/messages`,
      { params: { chatId: chatId }, withCredentials: true },
    );
  }

  getLastMessages(username: string) {
    return this.http.get<ResponseDTO<LastMessageDTO[]>>(
      `${this.API_URL}/chat/lastMessages/${username}`,
      { withCredentials: true },
    );
  }

  seenMessage(message: MessageDTO) {
    return this.http.put(`${this.API_URL}/chat/seenMessage`, message, {
      withCredentials: true,
    });
  }
}

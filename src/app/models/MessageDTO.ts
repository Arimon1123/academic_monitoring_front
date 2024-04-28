export interface MessageDTO {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  chatId: string;
  date: Date | string;
  seen: boolean;
}

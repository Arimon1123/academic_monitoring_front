import {ImageDTO} from "./ImageDTO";

export interface AnnouncementDTO{
  id: number;
  title:string;
  message:string;
  date: Date;
  publishingDate: Date;
  receivers: string;
  images: string[];
}

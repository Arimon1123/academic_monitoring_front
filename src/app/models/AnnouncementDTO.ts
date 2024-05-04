export interface AnnouncementDTO {
  id: number;
  title: string;
  message: string;
  date: Date;
  publishingDate: Date;
  receivers: string;
  images: string[];
}

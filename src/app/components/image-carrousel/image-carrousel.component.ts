import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageDTO } from '../../models/ImageDTO';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-image-carrousel',
  standalone: true,
  imports: [],
  templateUrl: './image-carrousel.component.html',
  styleUrl: './image-carrousel.component.css',
})
export class ImageCarrouselComponent {
  @Input() images?: ImageDTO[] = [];
  @Input() isForSaving? = true;
  @Input() imageUrls?: string[] = [];
  @Output() deleteImageEvent = new EventEmitter<ImageDTO[]>();
  protected API_URL = environment.API_URL;
  constructor() {}
  deleteImage(index: string) {
    this.images = this.images?.filter(image => image.id !== index);
    this.deleteImageEvent.emit(this.images as ImageDTO[]);
  }
}

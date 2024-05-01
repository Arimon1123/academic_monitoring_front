import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageDTO } from '../../models/ImageDTO';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-carrousel',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image-carrousel.component.html',
  styleUrl: './image-carrousel.component.css',
})
export class ImageCarrouselComponent {
  @Input() images: ImageDTO[] = [];
  @Output() deleteImageEvent = new EventEmitter<ImageDTO[]>();
  deleteImage(index: string) {
    this.images = this.images.filter((image) => image.id !== index);
    this.deleteImageEvent.emit(this.images);
  }
}

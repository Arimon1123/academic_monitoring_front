import {
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  OnInit,
  Output,
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ImageDTO } from '../../models/ImageDTO';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.css',
})
export class ImageInputComponent implements OnInit {
  @Input({ transform: numberAttribute }) maxFile: number | undefined;
  @Input() multiple: boolean | undefined;
  @Output() uploadImageEvent = new EventEmitter<ImageDTO[]>();
  images: ImageDTO[] = [];

  ngOnInit() {
    console.log(this.maxFile, this.multiple);
  }

  showImages(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    if (target.files?.length > 0) {
      if (
        target.files.length > this.maxFile! ||
        this.images.length + target.files.length > this.maxFile!
      ) {
        alert(`No puedes subir mas de ${this.maxFile} imágenes`);
        return;
      }
      for (let i = 0; i < target.files.length; i++) {
        const image = target.files[i];
        this.images.push({
          image: image,
          url: this.getImageUrl(image),
          id: uuid(),
        });
      }
    }
    this.uploadImageEvent.emit(this.images);
    this.images = [];
  }
  getImageUrl(image: File) {
    return URL.createObjectURL(image);
  }
}

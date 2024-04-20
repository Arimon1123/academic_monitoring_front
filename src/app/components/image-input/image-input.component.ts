import {Component, EventEmitter, Input, numberAttribute, Output} from '@angular/core';
import {v4 as uuid} from "uuid";
import {ImageDTO} from "../../models/ImageDTO";
import {map} from "rxjs";

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.css'
})
export class ImageInputComponent {

  @Input({transform: numberAttribute}) maxFile: number | undefined ;
  @Input() multiple: boolean | undefined ;
  @Output() uploadImageEvent = new EventEmitter<ImageDTO[]>();
  images: ImageDTO[] = [];

  ngOnInit(){
    console.log(this.maxFile, this.multiple);
  }

  showImages(event: any) {
    if (event.target.files.length > 0) {
      if ((event.target.files.length > this.maxFile!) || (this.images.length + event.target.files.length > this.maxFile!)) {
        alert(`No puedes subir mas de ${this.maxFile} imágenes`);
        return;
      }
      for (let i = 0; i < event.target.files.length; i++) {
        const image = event.target.files[i];
        this.images.push({ image: image, url: this.getImageUrl(image), id: uuid() });
      }
    }
    this.uploadImageEvent.emit(this.images);
    this.images = [];
  }
  getImageUrl(image: File) {
    return URL.createObjectURL(image);
  }
}

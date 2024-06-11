import {
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ImageDTO } from '../../models/ImageDTO';
import { ModalService } from '../../service/modal.service';

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
  @Input() images: ImageDTO[] = [];
  @ViewChild('content') content: TemplateRef<unknown> | undefined;

  constructor(private modalService: ModalService) {}
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
        this.openModal(
          'Error',
          'Solo puedes subir  ' + this.maxFile! + ' imágenes'
        );
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
  }
  getImageUrl(image: File) {
    return URL.createObjectURL(image);
  }

  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        size: 'small',
        hasContent: false,
        isSubmittable: false,
        title: title,
        message: message,
        isClosable: true,
      },
    });
  }
}

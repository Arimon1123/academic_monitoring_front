import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() size? = 'md';
  @Input() title? = 'Modal title';
  @Input() message? = 'Modal message';
  @Input() isSubmittable? = true;
  @Input() content: TemplateRef<unknown> | null;
  @Input() data?: any = {};
  @Input() hasContent? = false;
  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();
  constructor(private elementRef: ElementRef) {
    this.content = null;
    console.log(this.data);
  }
  close() {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }
  submit() {
    this.elementRef.nativeElement.remove();
    this.submitEvent.emit();
  }

  onKeyDownHandler(event: Event) {
    if (event instanceof KeyboardEvent) {
      if (event.key === 'Escape' || event.key === 'Enter') {
        this.close();
      }
    }
  }
}

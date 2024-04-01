import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {skipUntil} from "rxjs";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() size? = 'md';
  @Input() title? = 'Modal title';
  @Input() message? = 'Modal message';
  @Input() isSubmittable? = true;
  @Input() hasContent? = false;
  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();
  constructor(private elementRef: ElementRef) { }
  close(){
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }
  submit(){
    this.elementRef.nativeElement.remove();
    this.submitEvent.emit();
  }

  protected readonly skipUntil = skipUntil;
}

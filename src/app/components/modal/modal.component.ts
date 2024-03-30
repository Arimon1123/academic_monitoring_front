import { Component} from '@angular/core';
import { Modal} from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  modal: ModalInterface | undefined;
  ngOnInit() {
    const $modalElement = document.getElementById('modalEl');
    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    }
    const instanceOptions: InstanceOptions = {
      id: 'modal-1',
      override: true
    }
    this.modal = new Modal($modalElement, modalOptions, instanceOptions);
  }

  showModal() {
    this.modal!.show();
  }
  toggleModal() {
    this.modal!.toggle();
  }
  hideModal() {
    this.modal!.hide();
  }


}

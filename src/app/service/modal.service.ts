import {ComponentFactoryResolver, Inject, Injectable, Injector, TemplateRef, ViewContainerRef} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {ModalComponent} from "../components/modal/modal.component";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalNotifier?: Subject<string>;
  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, @Inject(DOCUMENT) private document: Document) {

  }
  open({content, options}: { content: TemplateRef<any>, options?: { data?: any, size?: string; title?: string, message?: string, isSubmittable?: boolean, hasContent?: boolean} }){
    const modalComponentFactory = this.resolver.resolveComponentFactory(ModalComponent);
    const contentViewRef = content.createEmbeddedView(null);
    const modalComponent = modalComponentFactory.create(this.injector, [contentViewRef.rootNodes]);
    modalComponent.instance.size = options?.size;
    modalComponent.instance.title = options?.title;
    modalComponent.instance.message = options?.message;
    modalComponent.instance.content = content;
    modalComponent.instance.data = options?.data;
    modalComponent.instance.isSubmittable = options?.isSubmittable;
    modalComponent.instance.hasContent = options?.hasContent;
    modalComponent.instance.closeEvent.subscribe(() => {
      this.closeModal();
    })
    modalComponent.instance.submitEvent.subscribe(() => {
      this.submitModal();
    })
    modalComponent.hostView.detectChanges()
    this.document.body.appendChild(modalComponent.location.nativeElement);
    this.modalNotifier = new Subject();
    return this.modalNotifier.asObservable();

  }
  closeModal(){
    this.modalNotifier?.complete();
  }
  submitModal(){
    this.modalNotifier?.next('submit');
    this.closeModal();
  }
}

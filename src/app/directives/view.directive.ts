import { AfterViewInit, Directive, ElementRef, EventEmitter, Host, OnDestroy, Output } from "@angular/core";

@Directive({
  standalone: true,
  selector: "[enterTheViewportNotifier]"
})
export class EnterTheViewportNotifierDirective implements AfterViewInit, OnDestroy {
  @Output() visibilityChange: EventEmitter<string> = new EventEmitter<string>();

  private _observer: IntersectionObserver | undefined;

  constructor(@Host() private _elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.0
    };

    this._observer = new IntersectionObserver(this._callback, options);

    this._observer.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy() {
    this._observer!.disconnect();
  }

  private _callback = (entries: any[], observer: any) => {
    entries.forEach(entry => {
      this.visibilityChange.emit(entry.isIntersecting ? 'VISIBLE' : 'HIDDEN')
    });
  };
}

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  @ViewChild('iframe1') iframe1!: ElementRef<HTMLIFrameElement>;
  @ViewChild('iframe2') iframe2!: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit(): void {
    window.addEventListener('message', this.onMessage.bind(this));
  }

  onMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin || !event.data?.move) return;

    const targetIframe = event.data.color === 'white' ? this.iframe2.nativeElement : this.iframe1.nativeElement;
    targetIframe.contentWindow?.postMessage(event.data, '*');
  }
}
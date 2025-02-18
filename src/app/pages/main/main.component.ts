import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements AfterViewInit {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;

  ngAfterViewInit(): void {
    window.addEventListener('message', this.onMessage.bind(this));
  }

  onMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin) return;

    if (event.data?.move) {
      const targetIframe =
        event.source === this.iframe1.nativeElement.contentWindow
          ? this.iframe2.nativeElement.contentWindow
          : this.iframe1.nativeElement.contentWindow;
      targetIframe?.postMessage(event.data, '*');
    }
  }

  changeBoardColor(event: any): void {
    const colorScheme = event.target.value;
    const colorMap: any = {
      classic: { dark: '#b58863', light: '#f0d9b5' },
      blue: { dark: '#1f4e78', light: '#cce7ff' },
      green: { dark: '#556b2f', light: '#dff4c6' },
      purple: { dark: '#663399', light: '#ffc0cb' },
    };

    const selectedColors = colorMap[colorScheme];

    [this.iframe1, this.iframe2].forEach((iframe) => {
      iframe.nativeElement.contentWindow?.postMessage(
        { type: 'changeColor', colors: selectedColors },
        '*'
      );
    });
  }
}
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainPageComponent implements AfterViewInit {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;

  constructor(private gameStateService: GameStateService) {}

  ngAfterViewInit(): void {
    window.addEventListener('message', this.onMessage.bind(this));
  }

  onMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin) return;

    if (event.data?.move) {
      const targetIframe = event.source === this.iframe1.nativeElement.contentWindow ? this.iframe2.nativeElement.contentWindow : this.iframe1.nativeElement.contentWindow;
      targetIframe?.postMessage(event.data, '*');
      
      // Update game state on move
      const currentState = this.gameStateService.getCurrentState() || [];
      currentState.push(event.data.move);
      const nextTurn = event.source === this.iframe1.nativeElement.contentWindow ? 'black' : 'white';
      this.gameStateService.updateGameState(currentState, nextTurn);
    }
  }
}
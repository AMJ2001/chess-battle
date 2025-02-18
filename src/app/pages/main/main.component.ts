import { Component } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';

@Component({ selector: 'app-mainpage', templateUrl: './main.component.html' })
export class MainPageComponent {
  constructor(private gameStateService: GameStateService) {}

  onMessage(event: MessageEvent) {
    if (event.data?.move) {
      const targetIframe = event.source === window.frames[0] ? window.frames[1] : window.frames[0];
      targetIframe?.postMessage(event.data, '*');
    }
  }
}

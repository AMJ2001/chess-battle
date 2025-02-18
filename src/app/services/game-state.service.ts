import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private gameState = new BehaviorSubject<any>(null);
  gameState$ = this.gameState.asObservable();

  updateGameState(state: any) {
    localStorage.setItem('chessGameState', JSON.stringify(state));
    this.gameState.next(state);
  }

  loadGameState() {
    const savedState = localStorage.getItem('chessGameState');
    if (savedState) this.gameState.next(JSON.parse(savedState));
  }
}

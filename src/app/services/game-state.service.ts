import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private gameState = new BehaviorSubject<any[]>([]); // Store moves as an array
  private currentTurn = new BehaviorSubject<string>('white'); // Track whose turn it is
  gameState$ = this.gameState.asObservable();
  currentTurn$ = this.currentTurn.asObservable();

  updateGameState(state: any[], turn: string) {
    localStorage.setItem('chessGameState', JSON.stringify(state));
    localStorage.setItem('chessCurrentTurn', turn);
    this.gameState.next(state);
    this.currentTurn.next(turn);
  }

  loadGameState() {
    const savedState = localStorage.getItem('chessGameState');
    const savedTurn = localStorage.getItem('chessCurrentTurn');
    if (savedState) {
      this.gameState.next(JSON.parse(savedState));
    }
    if (savedTurn) {
      this.currentTurn.next(savedTurn);
    }
  }

  getCurrentState(): any[] {
    return this.gameState.getValue();
  }

  getCurrentTurn(): string {
    return this.currentTurn.getValue();
  }
}
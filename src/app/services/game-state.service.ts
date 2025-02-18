import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private gameState = new BehaviorSubject<any[]>([]);
  private currentTurn = new BehaviorSubject<string>('white');
  gameState$ = this.gameState.asObservable();
  currentTurn$ = this.currentTurn.asObservable();

  updateGameState(move: any, turn: string) {
    const currentState = this.gameState.getValue();
    currentState.push(move);
    localStorage.setItem('chessGameState', JSON.stringify(currentState));
    localStorage.setItem('chessCurrentTurn', turn);
    this.gameState.next(currentState);
    this.currentTurn.next(turn);
  }

  loadGameState() {
    const savedState = localStorage.getItem('chessGameState');
    const savedTurn = localStorage.getItem('chessCurrentTurn');
    if (savedState) this.gameState.next(JSON.parse(savedState));
    if (savedTurn) this.currentTurn.next(savedTurn);
  }

  getCurrentTurn(): string {
    return this.currentTurn.getValue();
  }
}
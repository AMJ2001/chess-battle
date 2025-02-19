import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private storageKey = 'gameState';
  private colorKey = 'boardColor';
  private gameResetSubject = new BehaviorSubject<boolean>(false);
  gameReset$ = this.gameResetSubject.asObservable();
  private gameStateSubject = new BehaviorSubject<{ isReset: boolean }>({ isReset: false });
  gameState$ = this.gameStateSubject.asObservable();

resetGameState() {
  this.gameStateSubject.next({ isReset: true }); // Emit reset state
}

setGameReset(isReset: boolean) {
  this.gameResetSubject.next(isReset);
}

  saveGameState(gameState: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(gameState));
  }

  loadGameState() {
    const savedState = localStorage.getItem(this.storageKey);
    return savedState ? JSON.parse(savedState) : null;
  }

  setBoardColor(darkColor: string, lightColor: string) {
    localStorage.setItem(this.colorKey, JSON.stringify({ darkColor, lightColor }));
  }

  getBoardColor() {
    const colors = localStorage.getItem(this.colorKey);
    return colors ? JSON.parse(colors) : { darkColor: '#769656', lightColor: '#eeeed2' };
  }
}
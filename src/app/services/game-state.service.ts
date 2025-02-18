import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private storageKey = 'gameState';
  private colorKey = 'boardColor';

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
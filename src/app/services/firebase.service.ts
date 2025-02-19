import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, tap } from 'rxjs';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private db: AngularFireDatabase, private gameStateService: GameStateService) {}
  
  createGame(): string {
    const gameRef = this.db.list('games').push({
        moves: [],
        turn: 'w',
        isGameActive: true
    });
    return gameRef.key!;
}

  joinGame(gameId: string): Observable<any> {
    return this.db.object(`games/${gameId}`).valueChanges().pipe(
      tap((game: any) => {
        if (game?.isReset) {
          this.gameStateService.setGameReset(true);
        }
      })
    );
  }

  updateGame(gameId: string, moves: any[], turn: string, isReset: boolean = false) {
    if (!gameId || !moves || turn === undefined) {
      console.error('Invalid updateGame call:', { gameId, moves, turn, isReset });
      return;
    }
  
    this.db.object(`games/${gameId}`).update({ moves, turn, isReset })
      .catch((error) => {
        console.error('Firebase update failed:', error);
      });
  }
}
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
  
    console.log("Game created with ID:", gameRef.key);
    return gameRef.key!;
  }
  
  joinGame(gameId: string): Observable<any> {
    console.log("Joining game:", gameId);
    return this.db.object(`games/${gameId}`).valueChanges().pipe(
      tap((gameData) => {
        console.log("Received game data from Firebase:", gameData);
      })
    );
  }
  
  updateGame(gameId: string, moves: string[], turn: string) {
      console.log("Updating game:", gameId, moves, turn);
 
  
    this.db.object(`games/${gameId}`).update({ moves, turn })
      .catch(error => console.error('Firebase update failed:', error));
  }

  listenToGame(gameId: string): Observable<any> {
    console.log(`yooo`, this.db.object(`games/${gameId}`).valueChanges());
    return this.db.object(`games/${gameId}`).valueChanges();
  }
  

  
}
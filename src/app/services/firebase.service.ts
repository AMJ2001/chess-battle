import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private db: AngularFireDatabase) {}

  createGame(): string {
    const gameRef = this.db.list('games').push({ moves: [], turn: 'w' });
    return gameRef.key!;
  }

  joinGame(gameId: string): Observable<any> {
    return this.db.object(`games/${gameId}`).valueChanges();
  }

  updateGame(gameId: string, moves: any[], turn: string) {
    this.db.object(`games/${gameId}`).update({ moves, turn });
  }
}
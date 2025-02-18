import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private db: AngularFireDatabase) {}

  createGame() {
    const gameRef = this.db.list('games').push({ moves: [] });
    return gameRef.key;
  }

  joinGame(gameId: string) {
    return this.db.object(`games/${gameId}`).valueChanges();
  }

  updateGame(gameId: string, moves: any[]) {
    this.db.object(`games/${gameId}`).update({ moves });
  }
}
import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { GameStateService } from 'src/app/services/game-state.service';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
})
export class IframeComponent implements OnInit, AfterViewInit {
  @ViewChild(NgxChessBoardComponent) board!: NgxChessBoardComponent;
  private isWhiteBoard: boolean;

  constructor(private gameStateService: GameStateService, private cdr: ChangeDetectorRef) {
    this.isWhiteBoard = window.location.href.includes('white');
  }

  ngOnInit(): void {
    this.gameStateService.gameState$.subscribe(state => {
      if (state) {
        this.loadBoardState(state);
      }
    });

    this.gameStateService.currentTurn$.subscribe(turn => {
      if (this.isWhiteBoard) {
        this.board && (this.board.lightDisabled = turn !== 'white');
      } else {
        this.board && (this.board.darkDisabled = turn !== 'black');
      }
      this.cdr.detectChanges();
    });

    window.addEventListener('message', this.receiveMove.bind(this));
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onMove(event: any): void {
    const currentTurn = this.gameStateService.getCurrentTurn();
    if ((this.isWhiteBoard && currentTurn === 'white') || (!this.isWhiteBoard && currentTurn === 'black')) {
      window.parent.postMessage({ move: event.move }, '*');
      this.updateGameState(event.move);
    }
  }

  receiveMove(event: MessageEvent): void {
    if (event.origin !== window.location.origin) return;

    const moveData = event.data;
    if (moveData?.move) {
      this.board.move(moveData.move);
      this.updateGameState(moveData.move);
    }
  }

  private updateGameState(move: any): void {
    const currentState = this.gameStateService.getCurrentState() || [];
    currentState.push(move);
    const nextTurn = this.isWhiteBoard ? 'black' : 'white';
    this.gameStateService.updateGameState(currentState, nextTurn);
  }

  private loadBoardState(state: any): void {
    if (this.board) {
      this.board.reset();
      state.forEach((move: any) => {
        this.board.move(move);
      });
    }
  }
}
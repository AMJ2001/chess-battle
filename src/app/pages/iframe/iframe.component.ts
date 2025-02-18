import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
})
export class IframeComponent implements OnInit, AfterViewInit {
  @ViewChild(NgxChessBoardComponent) board!: NgxChessBoardComponent;
  isWhiteBoard: boolean;
  isCheckmate: boolean = false;

  constructor() {
    this.isWhiteBoard = window.location.search.includes('player=white');
  }

  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage.bind(this));
  }

  ngAfterViewInit(): void {
    this.loadGameState();
  }

  onMove(event: any): void {
    const fen = this.board.getFEN();
    localStorage.setItem('chessGameState', fen);
    window.parent.postMessage({ move: event.move, fen }, '*');
  }

  onCheckmate(): void {
    this.isCheckmate = true;
  }

  resetGame(): void {
    this.board.reset();
    this.isCheckmate = false;
    localStorage.removeItem('chessGameState');
  }

  receiveMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin) return;

    if (event.data?.move) {
      this.board.move(event.data.move);
    }  else if (event.data?.type === 'changeColor') {
      this.board.darkTileColor = event.data.colors.dark;
      this.board.lightTileColor = event.data.colors.light;
    } else if (event.data?.fen) {
      this.board.setFEN(event.data.fen);
    }
  }

  loadGameState(): void {
    const savedState = localStorage.getItem('chessGameState');
    if (savedState) {
      this.board.setFEN(savedState);
    } else {
      this.board.setFEN(
        this.isWhiteBoard
          ? 'start'
          : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      );
    }

    this.board.lightDisabled = !this.isWhiteBoard;
    this.board.darkDisabled = this.isWhiteBoard;

    if (!this.isWhiteBoard) {
      setTimeout(() => this.board.reverse(), 100);
    }
  }
}
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
})
export class IframeComponent implements OnInit, AfterViewInit {
  @ViewChild(NgxChessBoardComponent) board!: NgxChessBoardComponent;
  isWhiteBoard: boolean;

  constructor() {
    this.isWhiteBoard = window.location.search.includes('player=white');
  }

  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage.bind(this));
  }

  ngAfterViewInit(): void {
    this.board.setFEN(this.isWhiteBoard ? 'start' : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    this.board.lightDisabled = !this.isWhiteBoard;
    this.board.darkDisabled = this.isWhiteBoard;

    if (!this.isWhiteBoard) {
      setTimeout(() => this.board.reverse(), 100);
    }
  }

  onMove(event: any): void {
    window.parent.postMessage({ move: event.move }, '*');
  }

  receiveMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin) return;

    if (event.data?.move) {
      this.board.move(event.data.move);
    } else if (event.data?.type === 'changeColor') {
      this.board.darkTileColor = event.data.colors.dark;
      this.board.lightTileColor = event.data.colors.light;
    }
  }
}
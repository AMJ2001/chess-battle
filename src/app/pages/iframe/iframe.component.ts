import { Component, ViewChild } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';

@Component({ selector: 'app-iframe', templateUrl: './iframe.component.html' })
export class IframeComponent {
  @ViewChild(NgxChessBoardComponent) board!: NgxChessBoardComponent;

  movePiece(move: any) {
    this.board.move(move);
  }

  onMove(event: any) {
    window.parent.postMessage({ move: event.move }, '*');
  }
}
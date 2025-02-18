import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
})
export class IframeComponent implements OnInit, AfterViewInit {
  @ViewChild(NgxChessBoardComponent) board!: NgxChessBoardComponent;
  private color: 'white' | 'black';

  constructor() {
    this.color = new URLSearchParams(window.location.search).get('color') as 'white' | 'black';
  }

  ngOnInit(): void {
    window.addEventListener('message', this.receiveMove.bind(this));
  }

  ngAfterViewInit(): void {
    this.setMovePermissions();
  }

  onMove(event: any): void {
    if (!this.board) return;

    const move = event.move;
    window.parent.postMessage({ move, color: this.color }, '*');

    this.setMovePermissions(false);
  }

  receiveMove(event: MessageEvent): void {
    if (event.origin !== window.location.origin || !event.data?.move || event.data.color === this.color) return;

    this.board.move(event.data.move);
    this.setMovePermissions(true);
  }

  private setMovePermissions(enable = this.color === 'white') {
    if (!this.board) return;
    this.board.lightDisabled = !enable;
    this.board.darkDisabled = enable;
  }
}
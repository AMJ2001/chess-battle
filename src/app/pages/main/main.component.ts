import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements AfterViewInit, OnInit {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;
  
  boardColors: any = {
    classic: { dark: '#b58863', light: '#f0d9b5' },
    blue: { dark: '#1f4e78', light: '#cce7ff' },
    green: { dark: '#556b2f', light: '#dff4c6' },
    purple: { dark: '#663399', light: '#ffc0cb' },
  };

  selectedColorScheme: string = 'classic';
  gameId: string | null = null;
  isOnlineMode: boolean = false;
  createdByCurrentUser = false;
  moveHistory = new Set<string>();
  elapsedTime: number = 0;
  timerInterval: any;

  constructor(private gameStateService: GameStateService, private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const savedColor = this.gameStateService.getBoardColor();
    this.selectedColorScheme = Object.keys(this.boardColors).find(
      (key) => JSON.stringify(this.boardColors[key]) === JSON.stringify(savedColor)
    ) || 'classic';
    this.updateBoardColors();

    const storedMoves = localStorage.getItem('movesSet');
    if (storedMoves) {
      this.moveHistory = new Set(JSON.parse(storedMoves));
    }

    this.gameStateService.gameState$.subscribe((state) => {
      if (state?.isReset) {
        this.selectedColorScheme = 'classic';
        this.updateBoardColors();
        this.resetTimer();
      }
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener('message', this.onMessage.bind(this));
    this.cdr.detectChanges();
  }

  onMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin) return;

    if (event.data?.move) {
      const targetIframe =
        event.source === this.iframe1.nativeElement.contentWindow
          ? this.iframe2.nativeElement.contentWindow
          : this.iframe1.nativeElement.contentWindow;
      targetIframe?.postMessage(event.data, '*');

      this.moveHistory.add(event.data.move);
      localStorage.setItem('movesSet', JSON.stringify([...this.moveHistory]));

      if (this.moveHistory.size === 1) {
        this.startTimer();
      }

      if (this.isOnlineMode && this.gameId) {
        this.firebaseService.updateGame(this.gameId, event.data.move, event.data.turn);
      }
    }

    if (event.data?.checkmate) {
      alert('Checkmate! Game over.');
      this.resetGame();
    }
  }

  changeBoardColor(event: any): void {
    this.selectedColorScheme = event.target.value;
    const selectedColors = this.boardColors[this.selectedColorScheme];
    this.gameStateService.setBoardColor(selectedColors.dark, selectedColors.light);
    this.updateBoardColors();
  }

  updateBoardColors(): void {
    const colors = this.boardColors[this.selectedColorScheme];
    [this.iframe1, this.iframe2].forEach((iframe) => {
      iframe?.nativeElement.contentWindow?.postMessage({ type: 'changeColor', colors }, '*');
    });
  }

  resetGame(): void {
    const confirmReset = confirm('Are you sure you want to reset the game?');
    if (confirmReset) {
      this.moveHistory = new Set();
      this.resetTimer();
      [this.iframe1, this.iframe2].forEach((iframe, index) => {
        if (iframe?.nativeElement.contentWindow) {
          iframe.nativeElement.contentWindow.postMessage({ type: 'resetGame' }, '*');
        } else {
          console.warn(`Iframe ${index + 1} not found or not loaded`);
        }
      });
      if (this.gameId) {
        this.firebaseService.updateGame(this.gameId, [], 'white', true);
      }
    }
  }

  createOnlineGame(): void {
    this.createdByCurrentUser = true;
    this.gameId = this.firebaseService.createGame();
    alert(`Game created! Share this code: ${this.gameId}`);
  }

  joinOnlineGame(code: string | null): void {
    this.gameId = code;
    this.isOnlineMode = true;
    this.firebaseService.joinGame(code as string).subscribe((gameData) => {
      if (gameData?.moves) {
        [this.iframe1].forEach((iframe) => {
          iframe?.nativeElement.contentWindow?.postMessage({ type: 'loadMoves', moves: gameData.moves }, '*');
        });
        this.iframe2?.nativeElement.classList.add('hidden');
      }
    });
  }

  startTimer(): void {
    this.elapsedTime = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
  }

  resetTimer(): void {
    clearInterval(this.timerInterval);
    this.elapsedTime = 0;
  }
}
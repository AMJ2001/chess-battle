import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChessBoardModule } from 'ngx-chess-board'

import { IframeComponent } from './iframe.component';

@NgModule({
  declarations: [
    IframeComponent
  ],
  imports: [
    CommonModule,
    NgxChessBoardModule,
  ],
  exports: [IframeComponent]
})
export class IframeCompModule { }
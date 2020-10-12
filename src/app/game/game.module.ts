import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';

import { DeckComponent } from './deck/deck.component';
import { StatComponent } from './stat/stat.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [DeckComponent, StatComponent, ViewComponent],
  imports: [CommonModule, GameRoutingModule]
})
export class GameModule {}

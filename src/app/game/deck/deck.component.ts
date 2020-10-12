import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Card } from 'src/app/store.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {
  @Input() cards: Card[];

  constructor() {}

  ngOnInit(): void {}

  selectCard(card: Card): void {
    console.log('Selected', card);
  }
}

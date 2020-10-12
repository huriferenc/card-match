import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Card, StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {
  cards$: BehaviorSubject<Card[]>;
  stepNumber$: BehaviorSubject<number>;
  bestScore$: BehaviorSubject<number>;

  private selectedCard: Card;
  private previousSelectedCard: Card;

  private timeout: any;

  loading = false;

  constructor(private storeService: StoreService) {
    this.cards$ = this.storeService.cards$;
    this.stepNumber$ = this.storeService.stepNumber$;
    this.bestScore$ = this.storeService.bestScore$;

    const cards = this.cards$.getValue();
    const selectedCards = cards.filter((item) => item.selected);

    if (selectedCards.length === 1) {
      this.selectedCard = selectedCards[0];
      this.previousSelectedCard = selectedCards[0];
    } else if (selectedCards.length === 2) {
      this.selectedCard = selectedCards[0];
      this.previousSelectedCard = selectedCards[1];

      this.checkSelectedCards();
    }
  }

  ngOnInit(): void {}

  selectCard(card: Card): void {
    this.selectedCard = card;

    console.log(this.selectedCard);
    console.log(this.previousSelectedCard);

    const cards = this.cards$.getValue();
    const cardIndex = cards.findIndex((item) => item.id === this.selectedCard.id);
    cards[cardIndex].selected = true;

    this.updateCards(cards);

    if (!this.previousSelectedCard) {
      this.previousSelectedCard = this.selectedCard;
      return;
    }

    this.increaseSteps();

    this.checkSelectedCards();
  }

  private checkSelectedCards(): void {
    this.loading = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const cards = this.cards$.getValue();

      if (this.selectedCard.value === this.previousSelectedCard.value) {
        console.log('Cards are matching!');

        const newCards = cards.filter((item) => !item.selected);
        this.cards$.next(newCards);

        if (newCards.length === 0) {
          this.checkBestScore();
          this.storeService.newGame();
        }
      } else {
        console.log('No matching!');

        const newCards = cards.map((item) => {
          if (item.selected) {
            item.selected = false;
          }

          return item;
        });
        this.cards$.next(newCards);
      }

      this.selectedCard = null;
      this.previousSelectedCard = null;

      this.loading = false;
    }, 1000);
  }

  private increaseSteps(): void {
    const stepNumber = this.stepNumber$.getValue();
    this.stepNumber$.next(stepNumber + 1);
  }

  private checkBestScore(): void {
    const stepNumber = this.stepNumber$.getValue();
    const bestScore = this.bestScore$.getValue();

    if (stepNumber < bestScore) {
      this.bestScore$.next(stepNumber);
    }
  }

  private updateCards(cards): void {
    this.cards$.next(cards);
  }
}

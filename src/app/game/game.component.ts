import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, StoreService } from '../store.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  stepNumber$: BehaviorSubject<number>;
  bestScore$: BehaviorSubject<number>;
  cards$: BehaviorSubject<Card[]>;

  private selectedCard: Card;
  private previousSelectedCard: Card;

  private timeout: any;

  loading = false;

  /**
   * @TODO
   *
   * DELETE
   */
  stepNumber: number;

  constructor(private storeService: StoreService) {
    this.stepNumber$ = this.storeService.stepNumber$;
    this.bestScore$ = this.storeService.bestScore$;
    this.cards$ = this.storeService.cards$;

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

    this.stepNumber = this.stepNumber$.getValue();
  }

  ngOnInit(): void {}

  restart(): void {
    console.log(this.stepNumber);
    /**
     * @FIXME
     *
     * Dont reset previously selected card (selectedCard)
     */
    this.storeService.restartCurrentGame();
  }

  selectCard(card: Card): void {
    this.selectedCard = card;

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

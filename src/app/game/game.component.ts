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

  selectedCards: Card[];

  private timeout: any;

  loading = false;

  constructor(private storeService: StoreService) {
    this.stepNumber$ = this.storeService.stepNumber$;
    this.bestScore$ = this.storeService.bestScore$;
    this.cards$ = this.storeService.cards$;

    this.selectedCards = this.storeService.cards.filter((item) => item.selected);

    if (this.selectedCards.length === 2) {
      this.checkSelectedCards();
    }
  }

  ngOnInit(): void {}

  restart(): void {
    this.storeService.restartCurrentGame();
  }

  selectCard(card: Card): void {
    this.storeService.cards = this.storeService.cards.map((item) => {
      if (item.id === card.id) {
        item.selected = true;
      }

      return item;
    });

    this.selectedCards = this.storeService.cards.filter((item) => item.selected);

    if (this.selectedCards.length < 2) {
      return;
    }

    this.increaseSteps();

    this.checkSelectedCards();
  }

  private increaseSteps(): void {
    this.storeService.stepNumber = this.storeService.stepNumber + 1;
  }

  private checkSelectedCards(): void {
    this.loading = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.selectedCards[0].value === this.selectedCards[1].value) {
        console.log('Cards are matching!');

        this.storeService.cards = this.storeService.cards.filter((item) => !item.selected);

        if (this.storeService.cards.length === 0) {
          this.checkBestScore();
          this.storeService.newGame();
        }
      } else {
        console.log('No matching!');

        this.storeService.cards = this.storeService.cards.map((item) => {
          if (item.selected) {
            item.selected = false;
          }

          return item;
        });
      }

      this.loading = false;
    }, 1000);
  }

  private checkBestScore(): void {
    if (this.storeService.stepNumber < this.storeService.bestScore) {
      this.storeService.bestScore = this.storeService.stepNumber;
    }
  }
}

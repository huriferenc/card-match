import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardNumberValues, CardValues } from './card-values';
import { LocalStorage } from './local-storage';

export interface Card {
  id: number;
  value: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  stepNumber$ = new BehaviorSubject(0);
  stepNumberChanged = this.stepNumber$.asObservable();

  bestScore$ = new BehaviorSubject(100);
  bestScoreChanged = this.bestScore$.asObservable();

  cardNumber$ = new BehaviorSubject(CardNumberValues[0]);
  cardNumberChanged = this.cardNumber$.asObservable();

  cards$: BehaviorSubject<Card[]> = new BehaviorSubject([]);
  cardsChanged = this.cards$.asObservable();

  isFirstLoad = true;

  get stepNumber() {
    return this.stepNumber$.getValue();
  }
  set stepNumber(val: number) {
    this.stepNumber$.next(val);
  }

  get bestScore() {
    return this.bestScore$.getValue();
  }
  set bestScore(val: number) {
    this.bestScore$.next(val);
  }

  get cardNumber() {
    return this.cardNumber$.getValue();
  }
  set cardNumber(val: number) {
    this.cardNumber$.next(val);
  }

  get cards() {
    return this.cards$.getValue();
  }
  set cards(val: Card[]) {
    this.cards$.next(val);
  }

  constructor() {
    this.stepNumberChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && typeof value === 'number' && !Number.isNaN(value)) {
        LocalStorage.setItem('stepNumber', value);
        // console.log('stepNumber changed', value);
      }
    });
    this.bestScoreChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && typeof value === 'number' && !Number.isNaN(value)) {
        LocalStorage.setItem('bestScore', value);
        // console.log('bestScore changed', value);
      }
    });
    this.cardNumberChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && typeof value === 'number' && !Number.isNaN(value)) {
        LocalStorage.setItem('cardNumber', value);
        // console.log('cardNumber changed', value);
      }
    });
    this.cardsChanged.subscribe((value: Card[]) => {
      if (!this.isFirstLoad && value && Array.isArray(value)) {
        LocalStorage.setItem('cards', value);
        // console.log('cards changed', value);
      }
    });
  }

  checkStoreData() {
    const stepNumber: number = LocalStorage.getItem('stepNumber');
    const bestScore: number = LocalStorage.getItem('bestScore');
    const cardNumber: number = LocalStorage.getItem('cardNumber');
    const cards: Card[] = LocalStorage.getItem('cards');

    if (typeof stepNumber === 'number' && !Number.isNaN(stepNumber)) {
      this.stepNumber = stepNumber;
    }
    if (typeof bestScore === 'number' && !Number.isNaN(bestScore)) {
      this.bestScore = bestScore;
    }
    if (typeof cardNumber === 'number' && !Number.isNaN(cardNumber)) {
      this.cardNumber = cardNumber;
    }
    if (cards && Array.isArray(cards) && cards.length > 0) {
      this.cards = cards;
    } else {
      this.newGame();
    }

    this.isFirstLoad = false;
  }

  newGame(): void {
    this.resetSteps();
    this.generateCards();
  }

  restartCurrentGame(): void {
    this.resetSteps();
    this.resetSelectedCards();
  }

  private resetSteps(): void {
    this.stepNumber = 0;
  }

  private resetSelectedCards(): void {
    const cards = this.cards;

    const newCards = cards.map((item) => {
      if (item.selected) {
        item.selected = false;
      }

      return item;
    });

    this.cards = newCards;
  }

  private randomNumber(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  private generateRandomNumbers(length, min, max) {
    const randNums = [];
    while (randNums.length < length) {
      const randNum = this.randomNumber(min, max);
      if (randNums.indexOf(randNum) === -1) randNums.push(randNum);
    }

    return randNums;
  }

  generateCards(): void {
    const cardValuesIndexes = this.generateRandomNumbers(
      this.cardNumber / 2,
      0,
      CardValues.length - 1
    );

    const cardIndexes = this.generateRandomNumbers(this.cardNumber, 0, this.cardNumber - 1);

    let ind: number = 0;
    const cards: Card[] = new Array(this.cardNumber);
    for (let i = 0; i < cardIndexes.length; i++) {
      if (i > 0 && i % 2 === 0) {
        ind++;
      }

      cards[cardIndexes[i]] = {
        id: cardIndexes[i] + 1,
        value: CardValues[cardValuesIndexes[ind]],
        selected: false
      };
    }

    this.cards = cards;
  }
}

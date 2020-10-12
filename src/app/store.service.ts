import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardValues } from './card-values';
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

  bestScore$ = new BehaviorSubject(0);
  bestScoreChanged = this.bestScore$.asObservable();

  cardNumber$ = new BehaviorSubject(6);
  cardNumberChanged = this.cardNumber$.asObservable();

  cards$: BehaviorSubject<Card[]> = new BehaviorSubject([]);
  cardsChanged = this.cards$.asObservable();

  isFirstLoad = true;

  constructor() {
    this.stepNumberChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && typeof value === 'number' && !Number.isNaN(value)) {
        LocalStorage.setItem('stepNumber', value);
        console.log('stepNumber changed', value);
      }
    });
    this.bestScoreChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && typeof value === 'number' && !Number.isNaN(value)) {
        LocalStorage.setItem('bestScore', value);
        console.log('bestScore changed', value);
      }
    });
    this.cardNumberChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && typeof value === 'number' && !Number.isNaN(value)) {
        LocalStorage.setItem('cardNumber', value);
        console.log('cardNumber changed', value);
        this.generateCards();
      }
    });
    this.cardsChanged.subscribe((value: Card[]) => {
      if (!this.isFirstLoad && value && Array.isArray(value)) {
        LocalStorage.setItem('cards', value);
        console.log('cards changed', value);
      }
    });
  }

  checkStoreData() {
    const stepNumber: number = LocalStorage.getItem('stepNumber');
    const bestScore: number = LocalStorage.getItem('bestScore');
    const cardNumber: number = LocalStorage.getItem('cardNumber');
    const cards: Card[] = LocalStorage.getItem('cards');

    if (typeof stepNumber === 'number' && !Number.isNaN(stepNumber)) {
      this.stepNumber$.next(stepNumber);
    }
    if (typeof bestScore === 'number' && !Number.isNaN(bestScore)) {
      this.bestScore$.next(bestScore);
    }
    if (typeof cardNumber === 'number' && !Number.isNaN(cardNumber)) {
      this.cardNumber$.next(cardNumber);
    }
    if (cards && Array.isArray(cards) && cards.length === cardNumber) {
      this.cards$.next(cards);
    } else {
      this.generateCards();
    }

    this.isFirstLoad = false;
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

  generateCards() {
    const cardNumber = this.cardNumber$.getValue();

    const cardValues = CardValues.map((value) => ({ count: 2, value }));
    const cardIndexes = this.generateRandomNumbers(cardNumber, 0, cardNumber - 1);

    let ind: number = 0;
    const cards: Card[] = new Array(cardNumber);
    for (let i = 0; i < cardIndexes.length; i++) {
      if (cardValues[ind].count === 0) {
        ind++;
      }

      cards[cardIndexes[i]] = {
        id: cardIndexes[i],
        value: cardValues[ind].value,
        selected: false
      };

      cardValues[ind].count--;
    }

    this.cards$.next(cards);
  }
}

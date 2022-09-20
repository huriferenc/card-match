import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BestScore, Card, CardNumberValues, CardValues, MAX_BEST_SCORE } from './card.model';
import { LocalStorage } from './local-storage';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  stepNumber$ = new BehaviorSubject(0);
  stepNumberChanged = this.stepNumber$.asObservable();

  bestScore$ = new BehaviorSubject(MAX_BEST_SCORE);

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
    if (Number.isSafeInteger(val)) {
      this.bestScore$.next(val);
    } else {
      this.bestScore$.next(MAX_BEST_SCORE);
    }
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

  private bestScores: BestScore[] = [];

  constructor() {
    this.stepNumberChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && Number.isSafeInteger(value)) {
        LocalStorage.setItem('stepNumber', value);
      }
    });
    this.cardNumberChanged.subscribe((value: number) => {
      if (!this.isFirstLoad && Number.isSafeInteger(value)) {
        LocalStorage.setItem('cardNumber', value);
      }
    });
    this.cardsChanged.subscribe((value: Card[]) => {
      if (!this.isFirstLoad && value && Array.isArray(value)) {
        LocalStorage.setItem('cards', value);
      }
    });
  }

  checkStoreData() {
    const cardNumber: number = LocalStorage.getItem('cardNumber');
    const bestScores: BestScore[] = LocalStorage.getItem('bestScores');
    const stepNumber: number = LocalStorage.getItem('stepNumber');
    const cards: Card[] = LocalStorage.getItem('cards');

    if (Number.isSafeInteger(cardNumber)) {
      this.cardNumber = cardNumber;

      if (Array.isArray(bestScores) && bestScores.length > 0) {
        this.bestScores = [...bestScores];

        this.bestScore = this.bestScores.find(
          (item) => item.cardNumber === this.cardNumber
        )?.bestScore;
      }
    }
    if (Number.isSafeInteger(stepNumber)) {
      this.stepNumber = stepNumber;
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
    this.resetBestScore();
    this.generateCards();
  }

  restartCurrentGame(): void {
    this.resetSteps();
    this.resetSelectedAndMatchedCards();
  }

  private resetSteps(): void {
    this.stepNumber = 0;
  }

  private resetBestScore(): void {
    this.bestScore = this.bestScores.find((item) => item.cardNumber === this.cardNumber)?.bestScore;
  }

  private resetSelectedAndMatchedCards(): void {
    this.cards = this.cards.map((item) => {
      item.selected = false;
      item.matched = false;

      return item;
    });
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
        selected: false,
        matched: false
      };
    }

    this.cards = cards;
  }

  saveNewBestScore(value: number) {
    const existingBestScoreIndex = this.bestScores.findIndex(
      (item) => item.cardNumber === this.cardNumber
    );

    if (existingBestScoreIndex === -1) {
      this.bestScores.push({
        cardNumber: this.cardNumber,
        bestScore: value
      });
    } else {
      this.bestScores[existingBestScoreIndex].bestScore = value;
    }

    LocalStorage.setItem('bestScores', this.bestScores);
  }
}

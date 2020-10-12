import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { StoreService } from '../store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cardNumber$: BehaviorSubject<number>;

  selectedNumber: number;

  constructor(private storeService: StoreService, private router: Router) {
    this.cardNumber$ = this.storeService.cardNumber$;
    this.selectedNumber = this.cardNumber$.getValue();
  }

  ngOnInit(): void {}

  get numbers(): number[] {
    const numbers: number[] = [];

    for (let i = 3; i <= 10; i++) {
      numbers.push(i * 2);
    }

    return numbers;
  }

  changeCardNumber(value: string) {
    const num = Number(value);

    if (Number.isNaN(num) || num < 6 || num > 20) {
      console.log('Invalid card number!');
      return;
    }

    this.selectedNumber = num;
  }

  startNewGame() {
    this.cardNumber$.next(this.selectedNumber);
    this.storeService.newGame();

    this.router.navigateByUrl('/');
  }
}

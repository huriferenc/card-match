import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardNumberValues } from '../card.model';

import { StoreService } from '../store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  selectedNumber: number;
  numbers = CardNumberValues;

  constructor(private storeService: StoreService, private router: Router) {
    this.selectedNumber = this.storeService.cardNumber;
  }

  ngOnInit(): void {}

  changeCardNumber(value: string) {
    const num = Number(value);

    if (!Number.isSafeInteger(num) || !CardNumberValues.includes(num)) {
      console.log('Invalid card number!');
      return;
    }

    this.selectedNumber = num;
  }

  startNewGame() {
    this.storeService.cardNumber = this.selectedNumber;
    this.storeService.newGame();

    this.router.navigateByUrl('/');
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardValues } from 'src/app/card-values';
import { Card, StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  cards$: BehaviorSubject<Card[]>;

  constructor(private storeService: StoreService) {
    this.cards$ = this.storeService.cards$;
  }

  ngOnInit(): void {}

  restart(): void {
    this.storeService.generateCards();
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  stepNumber$: BehaviorSubject<number>;
  bestScore$: BehaviorSubject<number>;

  constructor(private storeService: StoreService) {
    this.stepNumber$ = this.storeService.stepNumber$;
    this.bestScore$ = this.storeService.bestScore$;
  }

  ngOnInit(): void {}
}

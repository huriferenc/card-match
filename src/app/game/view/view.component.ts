import { Component, OnInit } from '@angular/core';

import { StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  constructor(private storeService: StoreService) {}

  ngOnInit(): void {}

  restart(): void {
    this.storeService.newGame();
  }
}

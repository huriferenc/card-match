import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RulesComponent } from './rules/rules.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'rules',
    component: RulesComponent
  },
  {
    path: '',
    loadChildren: () => import('./game/game.module').then((m) => m.GameModule)
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

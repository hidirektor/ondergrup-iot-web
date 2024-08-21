import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./supporttickets.component').then(m => m.SupportTicketsComponent),
    data: {
      title: $localize`Destek Bildirimleri`
    }
  }
];


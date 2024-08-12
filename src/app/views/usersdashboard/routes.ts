import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./usersdashboard.component').then(m => m.UsersdashboardComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


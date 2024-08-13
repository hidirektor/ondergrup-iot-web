import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./subusers.component').then(m => m.SubusersComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


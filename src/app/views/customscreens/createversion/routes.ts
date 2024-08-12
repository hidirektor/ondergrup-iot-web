import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./createversion.component').then(m => m.CreateversionComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./hydraulic.component').then(m => m.HydraulicComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


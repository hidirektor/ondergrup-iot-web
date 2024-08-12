import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./allversions.component').then(m => m.AllVersionsComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


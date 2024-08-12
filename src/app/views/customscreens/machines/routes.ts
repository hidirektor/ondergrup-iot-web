import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./machines.component').then(m => m.MachinesComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


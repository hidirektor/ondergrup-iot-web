import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ownedmachines.component').then(m => m.OwnedmachinesComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


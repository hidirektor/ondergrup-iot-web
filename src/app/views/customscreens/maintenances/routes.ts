import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./maintenances.component').then(m => m.MaintenancesComponent),
    data: {
      title: $localize`Kullanıcılar`
    }
  }
];


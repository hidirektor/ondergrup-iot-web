import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./isstracker.component').then(m => m.IsstrackerComponent),
    data: {
      title: $localize`Profil`
    }
  }
];


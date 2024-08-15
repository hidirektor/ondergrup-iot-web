import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./editprofile.component').then(m => m.EditprofileComponent),
    data: {
      title: $localize`Profili Güncelle`
    }
  }
];


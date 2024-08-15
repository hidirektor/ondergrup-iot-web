import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./adduser.component').then(m => m.AdduserComponent),
    data: {
      title: $localize`Kullanıcı Ekle`
    }
  }
];


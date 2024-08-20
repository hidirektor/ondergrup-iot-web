import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sendnotification.component').then(m => m.SendNotificationComponent),
    data: {
      title: $localize`Bildirim Gönder`
    }
  }
];


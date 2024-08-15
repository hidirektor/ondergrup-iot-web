import {Routes} from '@angular/router';
import {DefaultLayoutComponent} from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Anasayfa'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./views/customscreens/usersdashboard/routes').then((m) => m.routes)
      },
      {
        path: 'add-user',
        loadChildren: () => import('./views/customscreens/adduser/routes').then((m) => m.routes)
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/customscreens/profile/routes').then((m) => m.routes)
      },
      {
        path: 'edit-profile/:userID',
        loadChildren: () => import('./views/customscreens/editprofile/routes').then((m) => m.routes)
      },
      {
        path: 'create-version',
        loadChildren: () => import('./views/customscreens/createversion/routes').then((m) => m.routes)
      },
      {
        path: 'all-versions',
        loadChildren: () => import('./views/customscreens/allversions/routes').then((m) => m.routes)
      },
      {
        path: 'machines',
        loadChildren: () => import('./views/customscreens/machines/routes').then((m) => m.routes)
      },
      {
        path: 'machines/:ownerName',
        loadChildren: () => import('./views/customscreens/ownedmachines/routes').then((m) => m.routes)
      },
      {
        path: 'subusers',
        loadChildren: () => import('./views/customscreens/subusers/routes').then((m) => m.routes)
      },
      {
        path: 'maintenances',
        loadChildren: () => import('./views/customscreens/maintenances/routes').then((m) => m.routes)
      },
      {
        path: 'hydraulic',
        loadChildren: () => import('./views/customscreens/hydraulic/routes').then((m) => m.routes)
      },
      {
        path: 'isstracker',
        loadChildren: () => import('./views/customscreens/isstracker/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Giriş Yap'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Kayıt Ol'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
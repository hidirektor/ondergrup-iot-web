import {Routes} from '@angular/router';
import {DefaultLayoutComponent} from './layout';
import {LandingComponent} from "./views/screens/landing/landing.component";

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent, // Direkt landing component gösteriliyor
    data: {
      title: 'Landing'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Anasayfa',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/screens/dashboards/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./views/screens/dashboards/usersdashboard/routes').then((m) => m.routes)
      },
      {
        path: 'add-user',
        loadChildren: () => import('./views/screens/userControl/adduser/routes').then((m) => m.routes)
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/screens/userControl/profile/routes').then((m) => m.routes)
      },
      {
        path: 'edit-profile/:userID',
        loadChildren: () => import('./views/screens/userControl/editprofile/routes').then((m) => m.routes)
      },
      {
        path: 'create-version',
        loadChildren: () => import('./views/screens/versionControl/createversion/routes').then((m) => m.routes)
      },
      {
        path: 'all-versions',
        loadChildren: () => import('./views/screens/versionControl/allversions/routes').then((m) => m.routes)
      },
      {
        path: 'machines',
        loadChildren: () => import('./views/screens/machineControl/machines/routes').then((m) => m.routes)
      },
      {
        path: 'machines/:ownerName',
        loadChildren: () => import('./views/screens/machineControl/ownedmachines/routes').then((m) => m.routes)
      },
      {
        path: 'subusers',
        loadChildren: () => import('./views/screens/userControl/subusers/routes').then((m) => m.routes)
      },
      {
        path: 'maintenances',
        loadChildren: () => import('./views/screens/machineControl/maintenances/routes').then((m) => m.routes)
      },
      {
        path: 'hydraulic',
        loadChildren: () => import('./views/screens/hydraulic/routes').then((m) => m.routes)
      },
      {
        path: 'isstracker',
        loadChildren: () => import('./views/screens/isstracker/routes').then((m) => m.routes)
      },
      {
        path: 'send-notification',
        loadChildren: () => import('./views/screens/adminPages/sendNotification/routes').then((m) => m.routes)
      },
      {
        path: 'tickets',
        loadChildren: () => import('./views/screens/adminPages/supportTickets/routes').then((m) => m.routes)
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
        path: 'generalPages',
        loadChildren: () => import('./views/screens/generalPages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/screens/generalPages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'landing',
    loadComponent: () => import('./views/screens/landing/landing.component').then(m => m.LandingComponent),
    data: {
      title: 'Landing'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/screens/generalPages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/screens/generalPages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Giriş Yap'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/screens/generalPages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Kayıt Ol'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
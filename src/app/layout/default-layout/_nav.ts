import {INavData} from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Sistem Ayarları'
  },
  {
    name: 'Tema',
    url: '/theme',
    iconComponent: {name: 'cil-puzzle'},
    children: [
      {
        name: 'Colors',
        url: '/theme/colors',
        iconComponent: {name: 'cil-drop'}
      },
      {
        name: 'Typography',
        url: '/theme/typography',
        linkProps: {fragment: 'headings'},
        iconComponent: {name: 'cil-pencil'}
      },
    ]
  },
  {
    title: true,
    name: 'Kullanıcı Yönetimi'
  },
  {
    name: 'Kullanıcıları Görüntüle',
    url: '/users',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Yetkililer',
    url: '/dashboard',
    iconComponent: {name: 'cil-check'},
    children: [
      {
        name: 'Mühendisleri Görüntüle',
        url: '/theme/colors'
      },
      {
        name: 'Teknikerleri Görüntüle',
        url: '/theme/typography',
        linkProps: {fragment: 'headings'}
      },
    ]
  },
  {
    title: true,
    name: 'Makine Yönetimi'
  },
  {
    name: 'Makineleri Görüntüle',
    url: '/dashboard',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-calculator' }
  },
  {
    name: 'Makine Yazılımı',
    url: '/dashboard',
    iconComponent: {name: 'cil-cloud-download'},
    children: [
      {
        name: 'Sürüm Güncelle',
        url: '/theme/colors'
      },
      {
        name: 'Eski Sürümler',
        url: '/theme/typography'
      },
    ]
  },
  {
    title: true,
    name: 'Bakım Kaydı Yönetimi'
  },
  {
    name: 'Bakım Kayıtları',
    url: '/dashboard',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-task' }
  },
  {
    title: true,
    name: 'Faydalı Linkler',
    class: 'mt-auto'
  },
  {
    name: 'Destek',
    url: 'https://hidirektor.com.tr',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];

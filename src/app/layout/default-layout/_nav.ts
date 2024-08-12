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
    name: 'Kullanıcı Ekle',
    url: '/add-user',
    iconComponent: {name: 'cil-check'}
  },
  {
    title: true,
    name: 'Makine Yönetimi'
  },
  {
    name: 'Makineleri Görüntüle',
    url: '/machines',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-calculator' }
  },
  {
    name: 'Makine Yazılımı',
    url: '/all-versions',
    iconComponent: {name: 'cil-cloud-download'},
    children: [
      {
        name: 'Sürüm Güncelle',
        url: '/create-version'
      },
      {
        name: 'Tüm Sürümler',
        url: '/all-versions'
      },
    ]
  },
  {
    title: true,
    name: 'Bakım Kaydı Yönetimi'
  },
  {
    name: 'Bakım Kayıtları',
    url: '/maintenances',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-task' }
  },
  {
    title: true,
    name: 'Hidrolik Ünitesi'
  },
  {
    name: 'Hidrolik Üniteleri',
    url: '/hydraulic',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-calculator' }
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
  },
  {
    name: 'Portainer Panel',
    url: 'https://ondergrup.hidirektor.com.tr:9443',
    iconComponent: { name: 'cilSettings' },
    attributes: { target: '_blank' }
  },
  {
    name: 'PhPMyAdmin',
    url: 'http://ondergrup.hidirektor.com.tr:8183',
    iconComponent: { name: 'cilBasket' },
    attributes: { target: '_blank' }
  },
  {
    name: 'MinIO Panel',
    url: 'http://ondergrup.hidirektor.com.tr:9099',
    iconComponent: { name: 'cilFile' },
    attributes: { target: '_blank' }
  }
];

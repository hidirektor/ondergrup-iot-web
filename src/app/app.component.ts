import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {IconSetService} from '@coreui/icons-angular';
import {iconSubset} from './icons/icon-subset';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet],
  styleUrls: ['./../assets/css/main.css']
})
export class AppComponent implements OnInit {
  title = 'ÖnderGrup - IoT';
  loading = true;

  private appVersion = '22.08.24';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private cookieService: CookieService
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        setTimeout(() => {
          this.hidePreloader();
        }, 1000);
        return;
      }
    });

    const storedVersion = this.cookieService.get('appVersion');
    if (storedVersion !== this.appVersion) {
      this.clearCookies();
      this.cookieService.set('appVersion', this.appVersion);
    }
  }

  hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.add('hidden'); // CSS'de "hidden" ile preloader gizlenir
    }
  }

  private clearCookies() {
    this.cookieService.deleteAll('/');
  }
}

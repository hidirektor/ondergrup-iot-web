import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {IconSetService} from '@coreui/icons-angular';
import {iconSubset} from './icons/icon-subset';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'ÖnderGrup IoT Yönetim Paneli';

  private appVersion = '13.08.24-2';

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
        return;
      }
    });

    const storedVersion = this.cookieService.get('appVersion');
    if (storedVersion !== this.appVersion) {
      this.clearCookies();
      this.cookieService.set('appVersion', this.appVersion);
    }
  }

  private clearCookies() {
    this.cookieService.deleteAll('/');
  }
}

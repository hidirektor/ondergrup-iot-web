import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  private scripts: HTMLScriptElement[] = [];
  private styles: HTMLLinkElement[] = [];

  constructor(private router: Router, private renderer: Renderer2) {}

  // Component yüklendiğinde CSS ve script'leri ekleyelim
  ngOnInit(): void {
    this.loadScripts();
    this.loadStyles();
    this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
    ).subscribe(event => {
      console.log('Yönlendirme başlıyor', event);
    });
  }

  // Component yok edildiğinde script ve CSS'leri kaldıralım
  ngOnDestroy(): void {
    this.removeScripts();
    this.removeStyles();
  }

  // Scriptleri dinamik olarak eklemek için fonksiyon
  loadScripts() {
    const scriptUrls = [
      'assets/js/bootstrap-5.0.0-beta2.min.js',
      'assets/js/tiny-slider.js',
      'assets/js/wow.min.js',
      'assets/js/polifill.js',
      'assets/js/main.js'
    ];

    scriptUrls.forEach(url => {
      const script = this.renderer.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true;
      this.renderer.appendChild(document.body, script);
      this.scripts.push(script); // Yüklenen scriptleri kaydediyoruz
    });
  }

  // CSS dosyalarını dinamik olarak eklemek için fonksiyon
  loadStyles() {
    const styleUrls = [
      'assets/css/bootstrap-5.0.0-beta2.min.css',
      'assets/css/LineIcons.2.0.css',
      'assets/css/tiny-slider.css',
      'assets/css/animate.css',
      'assets/css/main.css'
    ];

    styleUrls.forEach(url => {
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      this.renderer.appendChild(document.head, link);
      this.styles.push(link); // Yüklenen CSS'leri kaydediyoruz
    });
  }

  // Scriptleri kaldırmak için fonksiyon
  removeScripts() {
    this.scripts.forEach(script => {
      this.renderer.removeChild(document.body, script);
    });
  }

  // CSS'leri kaldırmak için fonksiyon
  removeStyles() {
    this.styles.forEach(link => {
      this.renderer.removeChild(document.head, link);
    });
  }

  // Login'e yönlendirme
  redirectToLogin() {
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']).catch(err => {
        console.error('Yönlendirme hatası:', err);
      });
    }
  }
}
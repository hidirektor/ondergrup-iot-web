import {ChangeDetectorRef, Component, computed, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective
} from '@coreui/angular';
import {NgStyle, NgTemplateOutlet} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {IconDirective} from '@coreui/icons-angular';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {delay, filter, map, tap} from 'rxjs/operators';
import {DomSanitizer} from "@angular/platform-browser";
import {ApiService} from "../../../services/api.service";
import {firstValueFrom} from "rxjs";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../http-core.interceptor";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [HttpClientModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective, ProgressComponent, NgStyle],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  private abortController: AbortController = new AbortController();

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode=> mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor(
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private cdr: ChangeDetectorRef) {
    super();
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  @Input() sidebarId: string = 'sidebar1';
  public userAvatar: any = '../../../../assets/onderlift_icon.png'; // Default avatar

  async ngOnInit(): Promise<void> {
    await this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    const token = this.apiService.getToken();
    const userName = this.apiService.getCookie('userName'); // Assuming the username is stored in a cookie

    if (token && userName) {
      try {
        const photo = await firstValueFrom(this.apiService.getProfilePhoto(userName));

        if (photo && photo.size > 0) {
          if (this.userAvatar) {
            URL.revokeObjectURL(this.userAvatar);
          }
          const objectURL = URL.createObjectURL(photo);
          this.userAvatar = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.cdr.detectChanges();
        }
      } catch (error) {
        console.error('Error loading user profile photo:', error);
      }
    }
  }

  showProfile(): void {
    this.abortController.abort();
    this.router.navigate(['/profile']);
  }

  editProfile(): void {
    this.abortController.abort();
    this.router.navigate(['/edit-profile']);
  }

  logout(): void {
    this.apiService.clearToken();
    this.apiService.deleteCookie('userName');
    this.router.navigate(['/login']);
  }
}

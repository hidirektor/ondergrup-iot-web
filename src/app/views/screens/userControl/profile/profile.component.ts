import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ApiService} from '../../../../services/api.service';
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from "@coreui/angular";
import {DatePipe, NgIf} from "@angular/common";
import {UserPreferences, UserProfile} from "../../../../models/profile-response.model";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";

interface IUser extends UserProfile {
  avatar?: any;
  preferences?: UserPreferences;
}

@Component({
  templateUrl: 'profile.component.html',
  standalone: true,
  imports: [
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    DatePipe,
    CardFooterComponent,
    AlertComponent,
    NgIf,
    HttpClientModule
  ],
  styleUrls: ['profile.component.scss'],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class ProfileComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;
  public currentUser: IUser | null = null;
  public profilePhotoUrl: string = '../../../../assets/onderlift_icon.png';

  constructor(
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    const token = this.apiService.getToken();
    const userID = this.apiService.getCookie('userID');

    try {
      const response = await firstValueFrom(this.apiService.getProfile(token, userID));
      this.currentUser = {
        ...response.payload.user,
        preferences: response.payload.userPreferences
      };

      if (this.currentUser?.userName) {
        try {
          const photo = await firstValueFrom(this.apiService.getProfilePhoto(this.currentUser.userName));
          if (photo && photo.size > 0) {
            const objectURL = URL.createObjectURL(photo);
            this.profilePhotoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL) as string;
          }
        } catch (error) {
          console.error('Profil fotoğrafı yüklenirken bir hata oluştu, varsayılan fotoğraf kullanılacak:', error);
          this.profilePhotoUrl = '../../../../assets/onderlift_icon.png';
        }
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      this.showAlert('Profil bilgileri yüklenemedi.', 'danger');
    } finally {
      // Change detection işlemini sonradan tetikleyin
      this.cdr.detectChanges();
    }
  }

  editProfile(): void {
    if (this.currentUser) {
      this.router.navigate(['/edit-profile']);
    }
  }

  showAlert(message: string, color: string): void {
    this.alertMessage = message;
    this.alertColor = color;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 2000);
  }
}
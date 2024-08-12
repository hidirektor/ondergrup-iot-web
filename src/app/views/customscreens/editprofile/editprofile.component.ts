import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ApiService} from '../../../services/api.service';
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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../http-core.interceptor";

interface IUser {
  userID: string;
  userName: string;
  userType: string;
  nameSurname: string;
  eMail: string;
  phoneNumber: string;
  companyName: string;
  isActive: boolean;
  createdAt: number;
  preferences: {
    language: boolean;
    nightMode: boolean;
  };
}

@Component({
  templateUrl: 'editprofile.component.html',
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
    HttpClientModule,
    ReactiveFormsModule
  ],
  styleUrls: ['editprofile.component.scss'],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class EditprofileComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;
  public currentUser: IUser | null = null;
  public profilePhotoUrl: string = '../../../../assets/onderlift_icon.png';
  public editProfileForm: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef;
  public loading: boolean = false;

  constructor(
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private cdr: ChangeDetectorRef,
      private fb: FormBuilder
  ) {
    this.editProfileForm = this.fb.group({
      nameSurname: ['', Validators.required],
      eMail: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      password: ['']  // Optional field for password change
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    const token = this.apiService.getToken();
    const userID = this.apiService.getCookie('userID');

    try {
      const response = await firstValueFrom(this.apiService.getProfile(token, userID));
      this.currentUser = response.payload.user as unknown as IUser;

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

      // Form alanlarını doldur
      this.editProfileForm.patchValue({
        nameSurname: this.currentUser.nameSurname,
        eMail: this.currentUser.eMail,
        companyName: this.currentUser.companyName,
      });

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const userName = this.currentUser?.userName;
      if (!userName) {
        this.showAlert('Kullanıcı adı bulunamadı, lütfen tekrar deneyin.', 'danger');
        return;
      }

      this.loading = true;

      try {
        await firstValueFrom(this.apiService.uploadProfilePhoto(userName, file));
        const objectURL = URL.createObjectURL(file);
        this.profilePhotoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL) as string;
        this.showAlert('Profil fotoğrafı başarıyla güncellendi.', 'success');
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        this.showAlert('Profil fotoğrafı yüklenirken bir hata oluştu.', 'danger');
      } finally {
        this.loading = false;
      }
    }
  }

  async saveProfile(): Promise<void> {
    if (this.editProfileForm.invalid) {
      this.showAlert('Lütfen tüm gerekli alanları doldurun.', 'danger');
      return;
    }

    const token = this.apiService.getToken();
    const userID = this.currentUser?.userID;

    if (!userID) {
      this.showAlert('Kullanıcı bilgileri eksik.', 'danger');
      return;
    }

    try {
      const userData = this.editProfileForm.value;

      // Eğer password alanı boşsa, userData nesnesinden password alanını kaldır
      if (!userData.password) {
        delete userData.password;
      }

      await firstValueFrom(this.apiService.updateProfile(token, userID, userData));
      this.showAlert('Profil başarıyla güncellendi.', 'success');
      this.router.navigate(['/profile']);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showAlert('Profil güncellenirken bir hata oluştu.', 'danger');
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
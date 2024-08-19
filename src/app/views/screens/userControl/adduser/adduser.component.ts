import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";

@Component({
  templateUrl: 'adduser.component.html',
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
  styleUrls: ['adduser.component.scss'],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class AdduserComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;
  public profilePhotoUrl: string = '../../../../assets/onderlift_icon.png';
  public addUserForm: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef;
  public loading: boolean = false;
  private profilePhotoFile: File | null = null;

  constructor(
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private cdr: ChangeDetectorRef,
      private fb: FormBuilder
  ) {
    this.addUserForm = this.fb.group({
      userName: ['', Validators.required],
      nameSurname: ['', Validators.required],
      eMail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      companyName: ['', Validators.required],
      userType: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.profilePhotoFile = input.files[0];
      const objectURL = URL.createObjectURL(this.profilePhotoFile);
      this.profilePhotoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL) as string;
      this.cdr.detectChanges();
    }
  }

  async saveUser(): Promise<void> {
    if (this.addUserForm.invalid) {
      this.showAlert('Lütfen tüm gerekli alanları doldurun.', 'danger');
      return;
    }

    const token = this.apiService.getToken();
    const userData = this.addUserForm.value;

    const operationPlatform = "Admin Panel";
    const sourceUserID = this.apiService.getCookie('userID');
    const affectedUserID = null;
    const affectedUserName = userData.userName;
    const affectedMachineID = null;
    const affectedMaintenanceID = null;
    const affectedHydraulicUnitID = null;

    try {
      this.loading = true;

      // Yeni kullanıcıyı ekleme
      await firstValueFrom(this.apiService.addUser(token, {operationPlatform, sourceUserID, affectedUserID, affectedUserName, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID, ...userData}));

      // Profil fotoğrafı varsa yükleme
      if (this.profilePhotoFile) {
        await firstValueFrom(this.apiService.uploadProfilePhoto(token, userData.userName, this.profilePhotoFile));
      }

      this.showAlert('Kullanıcı başarıyla eklendi.', 'success');
      this.router.navigate(['/usersdashboard']);
    } catch (error) {
      console.error('Kullanıcı eklenirken bir hata oluştu:', error);
      this.showAlert('Kullanıcı eklenirken bir hata oluştu.', 'danger');
    } finally {
      this.loading = false;
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
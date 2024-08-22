import {firstValueFrom} from "rxjs";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApiService} from "../../../../services/api.service";
import {Component, OnInit} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent
} from "@coreui/angular";

@Component({
  selector: 'app-sendnotification',
  templateUrl: './sendnotification.component.html',
  imports: [
    HttpClientModule,
    NgClass,
    NgForOf,
    DatePipe,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    AlertComponent,
    CardFooterComponent
  ],
  providers: [
    ApiService,
    NgbModal,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ],
  styleUrls: ['./sendnotification.component.scss'],
  standalone: true
})
export class SendNotificationComponent implements OnInit {
  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;
  public loading: boolean = false;
  public notificationForm: FormGroup;
  public mailForm: FormGroup;
  public pushForm: FormGroup;
  public showIconUrlInput: boolean = false;

  constructor(
      private fb: FormBuilder,
      private apiService: ApiService
  ) {
    this.notificationForm = this.fb.group({
      notificationType: ['mail', Validators.required]  // Varsayılan olarak 'mail' seçili
    });

    this.mailForm = this.fb.group({
      mailTitle: ['', Validators.required],
      mailDesc: ['', Validators.required]
    });

    this.pushForm = this.fb.group({
      pushTitle: ['', Validators.required],
      pushDesc: ['', Validators.required],
      pushSubTitle: [''],
      iconType: ['ondergrup_logo', Validators.required],
      icon: ['logo_appikon']
    });
  }

  ngOnInit(): void {
    this.onNotificationTypeChange();
  }

  onNotificationTypeChange(): void {
    const selectedType = this.mailForm.get('notificationType')?.value;

    if (selectedType === 'push') {
      this.showIconUrlInput = false;
      this.onIconTypeChange();
    }
  }

  onIconTypeChange(): void {
    const iconType = this.pushForm.get('iconType')?.value;

    if (iconType === 'ondergrup_logo') {
      this.showIconUrlInput = false;
      this.pushForm.get('icon')?.setValue('logo_appikon');
    } else {
      this.pushForm.get('icon')?.setValue('');
      this.pushForm.get('icon')?.setValidators([Validators.required]);
      this.showIconUrlInput = true;
    }
    this.pushForm.updateValueAndValidity();
  }

  async sendMailNotification(): Promise<void> {
    if (this.mailForm.invalid) {
      this.showAlert('Lütfen tüm alanları doldurun.', 'danger');
      return;
    }

    this.loading = true;

    const token = this.apiService.getToken();
    const { mailTitle, mailDesc } = this.mailForm.value;

    try {
      const body = { title: mailTitle, desc: mailDesc, notificationType: 'mail' };
      await firstValueFrom(this.apiService.sendAlertMail(token, body));
      this.showAlert('Bildirim başarıyla gönderildi.', 'success');
      this.mailForm.reset();
    } catch (error) {
      console.error('Bildirim gönderilirken hata oluştu:', error);
      this.showAlert('Bildirim gönderilirken bir hata oluştu.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async sendPushNotification(): Promise<void> {
    if (this.pushForm.invalid) {
      this.showAlert('Lütfen tüm alanları doldurun.', 'danger');
      return;
    }

    this.loading = true;

    const token = this.apiService.getToken();
    const { pushTitle, pushDesc, pushSubTitle, iconType, icon } = this.pushForm.value;

    try {
      let body;
      if(iconType === 'ondergrup_logo') {
        body = { heading: pushTitle, message: pushDesc, subtitle: pushSubTitle, iconType: "small_icon", icon };
      } else {
        body = { heading: pushTitle, message: pushDesc, subtitle: pushSubTitle, iconType, icon };
      }
      await firstValueFrom(this.apiService.sendNotification(token, body));
      this.showAlert('Bildirim başarıyla gönderildi.', 'success');
      this.pushForm.reset();
    } catch (error) {
      console.error('Bildirim gönderilirken hata oluştu:', error);
      this.showAlert('Bildirim gönderilirken bir hata oluştu.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  private showAlert(message: string, color: string): void {
    this.alertMessage = message;
    this.alertColor = color;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 2000);
  }
}
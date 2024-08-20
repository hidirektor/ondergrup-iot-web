import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {firstValueFrom} from 'rxjs';
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent
} from "@coreui/angular";
import {NgIf} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";

@Component({
  selector: 'app-send-notification',
  templateUrl: './sendnotification.component.html',
  standalone: true,
  imports: [
    HttpClientModule,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ReactiveFormsModule,
    CardFooterComponent,
    AlertComponent,
    NgIf
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ],
  styleUrls: ['./sendnotification.component.scss']
})
export class SendNotificationComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;
  public loading: boolean = false;
  public notificationForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private apiService: ApiService
  ) {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      notificationType: ['mail', Validators.required]
    });
  }

  ngOnInit(): void {}

  onNotificationTypeChange(): void {
    const selectedType = this.notificationForm.get('notificationType')?.value;
    if (selectedType === 'sms' || selectedType === 'mobile') {
      this.showAlert('Bu bildirim türü şu anda bakımda.', 'danger');
    }
  }

  async sendNotification(): Promise<void> {
    if (this.notificationForm.invalid) {
      this.showAlert('Lütfen tüm alanları doldurun.', 'danger');
      return;
    }

    const selectedType = this.notificationForm.get('notificationType')?.value;
    if (selectedType !== 'mail') {
      this.showAlert('Seçili bildirim türü şu anda kullanılamıyor.', 'danger');
      return;
    }

    this.loading = true;

    const token = this.apiService.getToken();
    const { title, desc, notificationType } = this.notificationForm.value;

    const body = {
      title,
      desc,
      notificationType
    };

    try {
      await firstValueFrom(this.apiService.sendAlertMail(token, body));
      this.showAlert('Bildirim başarıyla gönderildi.', 'success');

      // Başarılı bildirimden sonra formu temizle
      this.notificationForm.reset({
        title: '',
        desc: '',
        notificationType: 'mail'  // Varsayılan değer
      });

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
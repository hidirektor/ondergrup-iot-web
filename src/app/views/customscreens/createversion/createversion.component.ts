import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  ColComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import {ApiService} from "../../../services/api.service";
import {firstValueFrom} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

interface IVersion {
  id: number;
  versionTitle: string;
  versionDesc: string;
  versionCode: string;
  versionID: string;
  releaseDate: number;
}

@Component({
  templateUrl: 'createversion.component.html',
  styleUrls: ['createversion.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, CardFooterComponent, TableDirective, NgForOf, DatePipe, NgIf, AlertComponent, FormsModule],
  providers: [ApiService]
})
export class CreateversionComponent {

  public versionTitle: string = '';
  public versionDesc: string = '';
  public versionCode: string = '';
  public selectedFile: File | null = null;

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedExtensions = ['hex', 'bin'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.includes(fileExtension || '')) {
      this.selectedFile = file;
    } else {
      this.showAlert('Sadece .hex ve .bin dosyalarına izin verilmektedir.', 'danger');
      this.selectedFile = null;
    }
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (!this.selectedFile) {
      this.showAlert('Lütfen geçerli bir dosya seçin.', 'danger');
      return;
    }

    const versionCodePattern = /^\d+\.\d+\.\d+$/;
    if (!versionCodePattern.test(this.versionCode)) {
      this.showAlert('Versiyon kodu "x.x.x" formatında olmalıdır (örn. 1.0.0).', 'danger');
      return;
    }

    try {
      await firstValueFrom(this.apiService.createVersion(this.versionCode, this.versionTitle, this.versionDesc, this.selectedFile));
      this.showAlert('Versiyon başarıyla oluşturuldu.', 'success');
      this.router.navigate(['/dashboard']);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Versiyon oluşturulamadı.';
      this.showAlert(errorMessage, 'danger');
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